import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { scaffoldPost } from "../../scripts/new-post.mjs";
import { slugify } from "@/lib/slug-utils";

const temporaryDirs: string[] = [];

const makePostsDir = async () => {
	const dir = await mkdtemp(join(process.env.TMPDIR ?? tmpdir(), "new-post-"));
	temporaryDirs.push(dir);
	return dir;
};

afterEach(async () => {
	await Promise.all(temporaryDirs.splice(0).map((dir) => rm(dir, { recursive: true })));
});

describe("Slugify title", () => {
	it("creates a lowercase ASCII slug", () => {
		expect(slugify("  Café: My First Post!  ")).toBe("cafe-my-first-post");
		expect(slugify("---!!!---")).toBe("");
	});
});

describe("Scaffold post", () => {
	it("picks the next number and writes today's date and starter content", async () => {
		const dir = await makePostsDir();
		await writeFile(join(dir, "03-old-post.md"), "old");
		await writeFile(join(dir, "21-next-post.md"), "old");

		const path = await scaffoldPost("A New Post", dir, new Date(2026, 9, 30));

		expect(path).toBe(join(dir, "22-a-new-post.md"));
		expect(await readFile(path, "utf8")).toBe(
			`---\ntitle: "A New Post"\ndescription: "TODO: add a short description."\ndate: 2026-10-30\ncategories: []\ncover: ""\n---\n\n# A New Post\n`,
		);
	});

	it("rejects blank titles and preserves existing posts", async () => {
		const dir = await makePostsDir();
		await expect(scaffoldPost("  ", dir)).rejects.toThrow("Title must contain");
		await writeFile(join(dir, "01-same-title.md"), "keep me");

		const path = await scaffoldPost("Same Title", dir, new Date(2026, 0, 1));

		expect(path).toBe(join(dir, "02-same-title.md"));
		expect(await readFile(join(dir, "01-same-title.md"), "utf8")).toBe("keep me");
	});
});
