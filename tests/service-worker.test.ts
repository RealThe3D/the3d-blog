import { existsSync, readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";

const setup = () => {
	const handlers: Record<string, (event: unknown) => void> = {};
	const showNotification = vi.fn().mockResolvedValue(undefined);
	const openWindow = vi.fn().mockResolvedValue(undefined);
	const self = {
		location: new URL("https://example.com/service-worker.js"),
		registration: { showNotification },
		addEventListener: (name: string, handler: (event: unknown) => void) => {
			handlers[name] = handler;
		},
	};
	runInNewContext(readFileSync("public/service-worker.js", "utf8"), {
		self,
		clients: { openWindow },
		URL,
	});
	return { handlers, showNotification, openWindow };
};

describe("push service worker", () => {
	it("passes the payload URL through to the clicked notification", async () => {
		const { handlers, showNotification, openWindow } = setup();
		let pending: Promise<unknown> = Promise.resolve();
		handlers.push({
			data: {
				json: () => ({ title: "Post", body: "News", url: "/posts/hello" }),
			},
			waitUntil: (p: Promise<unknown>) => {
				pending = p;
			},
		});
		await pending;
		const options = showNotification.mock.calls[0][1];
		const close = vi.fn();
		handlers.notificationclick({
			notification: { data: options.data, close },
			waitUntil: (p: Promise<unknown>) => {
				pending = p;
			},
		});
		await pending;
		expect(close).toHaveBeenCalledOnce();
		expect(openWindow).toHaveBeenCalledWith("https://example.com/posts/hello");
	});

	it("references existing local default push assets", async () => {
		const { handlers, showNotification } = setup();
		let pending: Promise<unknown> = Promise.resolve();
		handlers.push({
			data: { json: () => ({ title: "Post" }) },
			waitUntil: (p: Promise<unknown>) => {
				pending = p;
			},
		});
		await pending;
		const { icon, badge } = showNotification.mock.calls[0][1];
		expect(existsSync(`public${icon}`)).toBe(true);
		expect(existsSync(`public${badge}`)).toBe(true);
	});
});
