import { isNotFound } from "@tanstack/react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

const storage = vi.hoisted(() => ({ getKeys: vi.fn(), getItem: vi.fn() }));

vi.mock("nitro/storage", () => ({ useStorage: () => storage }));
vi.mock("@tanstack/react-start", () => ({
	createServerFn: () => ({
		validator: () => ({
			handler: (handler: unknown) => handler,
		}),
		handler: (handler: unknown) => handler,
	}),
}));

import { getAllPosts, loadPost } from "@/lib/postLoader";

describe("loadPost error handling", () => {
	beforeEach(() => {
		vi.resetAllMocks();
		storage.getKeys.mockResolvedValue(["00-hello.md"]);
	});

	it("signals a 404 when no post matches the slug", async () => {
		const error = await loadPost({ data: { title: "missing" } }).catch(
			(error: unknown) => error,
		);
		expect(isNotFound(error)).toBe(true);
		expect(storage.getItem).not.toHaveBeenCalled();
	});

	it.each([null, undefined])(
		"signals a 404 for missing stored content (%s)",
		async (file) => {
			storage.getItem.mockResolvedValue(file);
			const error = await loadPost({ data: { title: "hello" } }).catch(
				(error: unknown) => error,
			);
			expect(isNotFound(error)).toBe(true);
		},
	);

	it("keeps storage failures as errors rather than 404s", async () => {
		storage.getKeys.mockRejectedValue(new Error("Storage unavailable"));
		await expect(loadPost({ data: { title: "hello" } })).rejects.toThrow(
			"Storage unavailable",
		);
	});

	it("keeps corrupt post content as an error", async () => {
		storage.getItem.mockResolvedValue({});
		await expect(loadPost({ data: { title: "hello" } })).rejects.toThrow(
			"Invalid post content",
		);
	});
});


describe("canonical post slugs", () => {
	beforeEach(() => {
		vi.resetAllMocks();
		storage.getKeys.mockResolvedValue(["18-DLSS5.md"]);
		storage.getItem.mockResolvedValue(`---\ntitle: DLSS5\ndate: 2025-01-01\ncover: /cover.jpg\ndescription: Test\n---\nHello`);
	});
	it("resolves a lowercase slug to a mixed-case filename", async () => {
		storage.getKeys.mockResolvedValue(["18-DLSS5.md"]);
		storage.getItem.mockResolvedValue(`---\ntitle: DLSS5\ndate: 2025-01-01\ncover: /cover.jpg\ndescription: Test\n---\nHello`);
		const post = await loadPost({ data: { title: "dlss5" } });
		expect(post.slug).toBe("dlss5");
		expect(storage.getItem).toHaveBeenCalledWith("18-DLSS5.md");
	});

	it.each(["DLSS5", "18-DLSS5"])("resolves legacy slug %s", async (title) => {
		const post = await loadPost({ data: { title } });
		expect(post.slug).toBe("dlss5");
	});

	it("lists canonical lowercase slugs", async () => {
		const posts = await getAllPosts();
		expect(posts[0].title).toBe("dlss5");
	});
});
