import { defineConfig, s } from "velite";
import readingTime from "reading-time";
import slugify from "@sindresorhus/slugify";
import rehypeShiki from "@shikijs/rehype";

function clean(pathname: string) {
  return pathname.replace("posts/", "");
}
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
