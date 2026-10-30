import { beforeEach, expect, it, vi } from "vitest";

const storage = vi.hoisted(() => ({ getKeys: vi.fn(), getItem: vi.fn() }));

vi.mock("nitro/storage", () => ({ useStorage: () => storage }));
vi.mock("@tanstack/react-start", () => ({
	createServerFn: () => ({
		validator: () => ({ handler: (handler: unknown) => handler }),
		handler: (handler: unknown) => handler,
	}),
}));

import { getAllPosts } from "@/lib/postLoader";

beforeEach(() => vi.resetAllMocks());

it("returns sorted post metadata without rendering or returning post bodies", async () => {
	storage.getKeys.mockResolvedValue(["01-old.md", "02-new.md", "other.txt"]);
	storage.getItem.mockImplementation(
		async (key: string) => `---
title: ${key}
date: ${key.startsWith("01") ? "2023-01-01" : "2024-01-01"}
categories: [Tech]
cover: /cover.jpg
description: Summary
---
# Body content`,
	);

	const posts = await getAllPosts();
	expect(posts.map((post) => post.title)).toEqual(["new", "old"]);
	expect(posts[0]).toEqual({
		title: "new",
		frontmatter: {
			title: "02-new.md",
			date: new Date("2024-01-01"),
			categories: ["Tech"],
			cover: "/cover.jpg",
			description: "Summary",
		},
	});
	expect(storage.getItem).toHaveBeenCalledTimes(2);
});
