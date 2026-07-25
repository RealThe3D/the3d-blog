import rehypeShiki from "@shikijs/rehype";
import slugify from "@sindresorhus/slugify";
import readingTime from "reading-time";
import { defineConfig, s } from "velite";

function clean(pathname: string) {
  return pathname.replace(/^posts\/\d{2}-/, "");
}

// function slugify(str: string): string {
//   return str
//     .toLowerCase()
//     .trim()
//     .replace(/[^\w\s-]/g, "")
//     .replace(/[\s_]+/g, "-")
//     .replace(/^-+|-+$/g, "");
// }

export default defineConfig({
  collections: {
    posts: {
      name: "Post",
      pattern: "posts/**/*.mdx",
      schema: s
        .object({
          title: s.string(),
          description: s.string(),
          date: s.isodate(),
          categories: s.array(s.string()),
          cover: s.image(),
          content: s.mdx(),
          slug: s.path(),
        })
        .transform((data) => ({
          ...data,
          slug: slugify(clean(data.slug)),
          readTime: Math.ceil(readingTime(data.content).minutes),
        })),
    },
  },
  mdx: {
    // deno-lint-ignore no-explicit-any
    rehypePlugins: [[rehypeShiki as any, { theme: "one-dark-pro" }]],
  },
});
