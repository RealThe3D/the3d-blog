import { describe, expect, it, vi } from "vitest";
import { buildNotificationPayload, createNotifyHandler } from "@/lib/notification";

const dependencies = () => ({
	secret: "secret",
	loadPost: vi.fn(async (slug: string) =>
		slug === "missing"
			? null
			: "---\ntitle: Hello\ndescription: World\n---\nText",
	),
	claim: vi.fn(async () => true),
	subscriptions: vi.fn(async () => [
		{ endpoint: "https://example.com", p256dh: "key", auth: "auth" },
	]),
	send: vi.fn(async () => {}),
	remove: vi.fn(async () => {}),
	configure: vi.fn(),
	log: vi.fn(),
});
const request = (body: unknown, authorization = "Bearer secret") =>
	new Request("http://localhost/api/notify", {
		method: "POST",
		headers: { authorization, "content-type": "application/json" },
		body: JSON.stringify(body),
	});

describe("notification pipeline", () => {
	it("fails closed without a secret and rejects malformed requests before side effects", async () => {
		const deps = dependencies();
		deps.secret = "";
		expect(
			(
				await createNotifyHandler(deps)(
					request({ slugs: ["18-DLSS5"] }, "Bearer undefined"),
				)
			).status,
		).toBe(401);
		deps.secret = "secret";
		expect(
			(await createNotifyHandler(deps)(request({ slugs: ["../escape"] })))
				.status,
		).toBe(400);
		expect(deps.configure).not.toHaveBeenCalled();
	});
	it("builds canonical post URLs and fallback content", () => {
		expect(buildNotificationPayload("18-DLSS5", { title: "Hello" })).toEqual({
			title: "Hello",
			body: "New post published",
			url: "/posts/dlss5",
		});
	});
	it("processes valid posts independently, claims once, and cleans expired subscriptions", async () => {
		const deps = dependencies();
		deps.claim.mockResolvedValueOnce(true).mockResolvedValueOnce(false);
		deps.send.mockRejectedValueOnce({ statusCode: 404 });
		const response = await createNotifyHandler(deps)(
			request({ slugs: ["missing", "18-DLSS5", "19-other"] }),
		);
		const result = await response.json();
		expect(response.status).toBe(500);
		expect(result.notified).toBe(1);
		expect(result.skipped).toBe(1);
		expect(result.failed).toBe(1);
		expect(deps.remove).toHaveBeenCalledWith("https://example.com");
		expect(deps.send).toHaveBeenCalledTimes(1);
	});
});
