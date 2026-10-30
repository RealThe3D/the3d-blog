import sharp from "sharp";
import { expect, it, vi } from "vitest";

const storage = vi.hoisted(() => ({ getItemRaw: vi.fn() }));
vi.mock("nitro/storage", () => ({ useStorage: () => storage }));

import { Route } from "./image";

it.each([80, 160])("serves a %ipx WebP thumbnail", async (width) => {
	storage.getItemRaw.mockResolvedValue(
		await sharp({
			create: { width: 400, height: 400, channels: 3, background: "red" },
		})
			.png()
			.toBuffer(),
	);
	const handlers = Route.options.server?.handlers;
	const handler = typeof handlers === "object" ? handlers.GET : undefined;
	if (typeof handler !== "function") throw new Error("Missing image handler");
	const response = await handler({
		request: new Request(`http://localhost/api/image?src=cover.png&w=${width}`),
	} as never);
	if (!(response instanceof Response)) throw new Error("Expected a response");
	expect(response.headers.get("content-type")).toBe("image/webp");
	expect(
		(await sharp(Buffer.from(await response.arrayBuffer())).metadata()).width,
	).toBe(width);
});
