import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { urlBase64ToUint8Array } from "@/lib/url";

beforeEach(() => {
	// The implementation reads `window.atob`, which only exists in the browser.
	// Stub it with Node's global atob so the tests run in the default node environment.
	vi.stubGlobal("window", { atob: globalThis.atob });
});

// Encode bytes as unpadded URL-safe base64, like a server pushing a VAPID key.
const toUrlSafeBase64 = (bytes: number[]) =>
	Buffer.from(bytes)
		.toString("base64")
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");

afterEach(() => {
	vi.unstubAllGlobals();
});

describe("urlBase64ToUint8Array", () => {
	it("decodes standard padded base64", () => {
		const result = urlBase64ToUint8Array("AQIDBA==");

		expect(Array.from(result)).toEqual([1, 2, 3, 4]);
	});

	it("decodes unpadded base64 by re-adding the padding", () => {
		// "AQIDBA" has length 6, so (4 - 6 % 4) % 4 === 2 missing "=" chars
		expect(Array.from(urlBase64ToUint8Array("AQIDBA"))).toEqual([1, 2, 3, 4]);
	});

	it("handles lengths that need no padding", () => {
		// length divisible by 4: padding added is an empty string
		expect(Array.from(urlBase64ToUint8Array("AQID"))).toEqual([1, 2, 3]);
	});

	it("converts base64url characters '-' and '_' to '+' and '/'", () => {
		// 0xFF 0xFE decodes from "+/8" (padded: "+/8=")
		expect(Array.from(urlBase64ToUint8Array("+_8"))).toEqual([0xfb, 0xff]);
	});

	it("round-trips arbitrary bytes encoded as URL-safe base64", () => {
		const bytes = Array.from({ length: 65 }, (_, i) => (i * 37 + 11) % 256);
		const encoded = toUrlSafeBase64(bytes);

		expect(Array.from(urlBase64ToUint8Array(encoded))).toEqual(bytes);
	});

	it("round-trips 65 bytes, the typical VAPID public key length", () => {
		const bytes = Array.from({ length: 65 }, (_, i) => i);
		const encoded = toUrlSafeBase64(bytes);

		expect(Array.from(urlBase64ToUint8Array(encoded))).toEqual(bytes);
	});

	it("returns a Uint8Array", () => {
		expect(urlBase64ToUint8Array("AQID")).toBeInstanceOf(Uint8Array);
	});

	it("returns an empty array for an empty string", () => {
		const result = urlBase64ToUint8Array("");

		expect(result).toBeInstanceOf(Uint8Array);
		expect(result.length).toBe(0);
	});
});
