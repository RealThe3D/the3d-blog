import { readdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { slugify } from "../src/lib/slug-utils.ts";

const localDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const scaffoldPost = async (
  title,
  postsDir = "content/posts",
  date = new Date(),
) => {
  const normalizedTitle = title.trim();
  const slug = slugify(normalizedTitle);
  if (!normalizedTitle || !slug) {
    throw new Error("Title must contain at least one letter or number.");
  }

  let highestNumber = 0;
  for (const entry of await readdir(postsDir, { withFileTypes: true })) {
    if (!entry.isFile()) continue;
    const match = /^(\d+)-.+\.md$/i.exec(entry.name);
    if (match) highestNumber = Math.max(highestNumber, Number(match[1]));
  }

  const number = String(highestNumber + 1).padStart(2, "0");
  const path = join(postsDir, `${number}-${slug}.md`);
  const content = [
    "---",
    `title: ${JSON.stringify(normalizedTitle)}`,
    'description: "TODO: add a short description."',
    `date: ${localDate(date)}`,
    "categories: []",
    'cover: ""',
    "---",
    "",
    `# ${normalizedTitle}`,
    "",
  ].join("\n");

  await writeFile(path, content, { flag: "wx" });
  return path;
};

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const args = process.argv[2] === "--"
    ? process.argv.slice(3)
    : process.argv.slice(2);
  const title = args.join(" ");
  if (!title.trim()) {
    console.error('Usage: deno task new-post -- "Post title"');
    process.exit(1);
  }
  try {
    const path = await scaffoldPost(title);
    console.log(`Created ${path}`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

export { scaffoldPost };
