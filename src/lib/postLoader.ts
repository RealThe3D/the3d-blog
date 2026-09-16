import fs from "node:fs/promises";
import { renderHtml } from "@tanstack/markdown/html";
import { parseMarkdown } from "@tanstack/markdown/parser";
import { createServerFn } from "@tanstack/react-start";
import matter from "gray-matter";
import { z } from "zod";
import { clean } from "./slug-utils";
import readingTime from "reading-time";
import { compareDesc } from "date-fns";
const frontmatterSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  categories: z.array(z.string()).default([]),
  cover: z.string(),
  description: z.string(),
});

type PostFrontmatter = z.infer<typeof frontmatterSchema>;

export type { PostFrontmatter as Post };

export const loadPost = createServerFn()
  .validator(z.object({ title: z.string() }))
  .handler(async ({ data }) => {
    const postsFolder = await fs.readdir(`content/posts`);
    const post = postsFolder.find(
      (file) => clean(file.slice(0, -3)) === data.title,
    );

    const file = await fs.readFile(`content/posts/${post}`, "utf-8");
    if (!post) throw new Error("Post not found");
    const { data: fmData, content } = matter(file);

    const frontmatter: PostFrontmatter = frontmatterSchema.parse(fmData);
    const document = parseMarkdown(content, { frontmatter: false });
    const html = renderHtml(document);
    const readTime = Math.ceil(readingTime(html).minutes);

    return { frontmatter, html, document, readTime };
  });

export const getAllPosts = createServerFn().handler(async () => {
  const contentFolder = await fs.readdir("content/posts");

  const posts = await Promise.all(
    contentFolder
      .filter((filename) => filename.endsWith(".md"))
      .map(async (filename) => {
        const file = await fs.readFile(`content/posts/${filename}`, "utf-8");
        const { data: fmData, content } = matter(file);
        const frontmatter = frontmatterSchema.parse(fmData);
        const document = parseMarkdown(content, { frontmatter: false });
        const html = renderHtml(document);

        return {
          title: clean(filename.slice(0, -3)),
          frontmatter,
          html,
          document,
        };
      }),
  );

  return posts.sort((a, b) =>
    compareDesc(a.frontmatter.date, b.frontmatter.date),
  );
});
