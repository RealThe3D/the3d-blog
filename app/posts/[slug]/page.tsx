import Image from "next/image";
import { notFound } from "next/navigation";
import { posts } from "@/.velite";
import { MDXContent } from "@/components/Mdx";
import { addMinutes, format } from "date-fns";

interface PostProps {
  params: Promise<{ slug: string }>;
}

function getPostBySlug(slug: string) {
  return posts.find((post) => post.slug === slug);
}

export default async function PostPage({ params }: PostProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) return notFound();

  const postDate = format(
    addMinutes(new Date(post.date), new Date(post.date).getTimezoneOffset()),
    "MMMM d, yyyy"
  );

  return (
    <div className="flex flex-col justify-center divide-y mx-auto py-12 max-w-5xl">
      <header
        className="text-5xl font-extrabold self-center py-4 dark:text-[#FF3366]"
        dangerouslySetInnerHTML={{ __html: post.title }}
      />
      <Image
        src={post.cover}
        alt="some ai generated image i dunno"
        width={512}
        height={512}
        className="w-96 h-96 md:w-[512px] md:h-[512px] self-center m-4 rounded-xl border-none shadow-lg dark:shadow-none"
      />
      <section className="flex flex-col md:flex-row py-4">
        <div className="flex flex-col w-2/3 md:w-1/4 font-medium divide-y place-self-center md:place-self-start">
          <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 pb-4">
            <h2>Tags:</h2>
            <p className="text-sm">{post.categories.join(", ")}</p>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 py-6">
            <h2>Read Time:</h2>
            <p className="text-sm">{post.readTime} Min</p>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 py-6">
            <h2>Date Published:</h2>
            <time className="text-sm" dateTime={postDate}>
              {postDate}
            </time>
          </div>
        </div>
        <article className="prose p-4 dark:prose-invert dark:prose-hotpink">
          <MDXContent code={post.content} />
        </article>
      </section>
    </div>
  );
}

export async function generateMetadata({ params }: PostProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (post == null) return {};
  return { title: post.title, description: post.description };
}

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}
