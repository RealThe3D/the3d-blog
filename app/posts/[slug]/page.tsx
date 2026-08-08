import { addMinutes, format } from "date-fns";
import Image from "next/image";
import { notFound } from "next/navigation";
import { posts } from "@/.velite";
import BackToPosts from "@/components/BackToPosts";
import { MDXContent } from "@/components/Mdx";
import ProgressBar from "@/components/ProgressBar";

interface PostProps {
  params: Promise<{ slug: string }>;
}

const getPostBySlug = (slug: string) => {
  return posts.find((post) => post.slug === slug);
};

const PostPage = async ({ params }: PostProps) => {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) return notFound();

  const postDate = format(
    addMinutes(new Date(post.date), new Date(post.date).getTimezoneOffset()),
    "MMMM d, yyyy",
  );

  return (
    <>
      <ProgressBar />
      <div className="prose dark:prose-stone prose-img:rounded-lg dark:prose-invert mx-auto p-6">
        <BackToPosts />
        <header className="flex flex-col">
          <div className="flex gap-2.5 items-center text-sm py-6">
            <span className="uppercase bg-secondary dark:bg-blue-950 text-blue-950 dark:text-secondary px-3 rounded-2xl text-xs py-1 tracking-wider">
              {post.categories[0]}
            </span>
            <span className="border-stone-450 dark:border-white/15 border-2 rounded-full" />
            <span className="text-stone-450">{postDate}</span>
            <span className="dark:border-white/15 border-2 rounded-full" />
            <span className="text-stone-450">{post.readTime} min read</span>
          </div>
          <h1>{post.title}</h1>
          <Image
            className="h-80 object-cover border rounded-xl mt-0"
            width={1080}
            height={1080}
            src={post.cover}
            alt="ai generated cover image"
          />
        </header>
        <article>
          <MDXContent code={post.content} />
        </article>
      </div>
    </>
  );
};

export async function generateMetadata({ params }: PostProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (post == null) return {};

  const coverUrl = post.cover;

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: coverUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: coverUrl,
    },
  };
}

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export default PostPage;
