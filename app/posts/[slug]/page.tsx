import { addMinutes, format } from "date-fns";
import { allPosts } from "contentlayer/generated";
import Image from "next/image";
import { useMDXComponent } from "next-contentlayer/hooks";
export const generateStaticParams = async () =>
  allPosts.map((post) => ({ slug: post._raw.flattenedPath }));

export const generateMetadata = ({ params }: { params: { slug: string } }) => {
  const post = allPosts.find((post) => post._raw.flattenedPath === params.slug);
  if (!post) throw new Error(`Post not found for slug: ${params.slug}`);
  return { title: post.title };
};
const PostPage = ({ params }: { params: { slug: string } }) => {
  const post = allPosts.find((post) => post._raw.flattenedPath === params.slug);
  if (!post) throw new Error(`Post not found for slug: ${params.slug}`);
  const postDate = format(
    addMinutes(new Date(post.date), new Date(post.date).getTimezoneOffset()),
    "MMMM d, yyyy"
  );
  const MDXContent = useMDXComponent(post.body.code);

  return (
    <div className="flex flex-col justify-center divide-y mx-auto py-12 max-w-5xl">
      <header
        className="text-5xl font-extrabold self-center py-4 dark:text-[#FF3366]"
        dangerouslySetInnerHTML={{ __html: post.title }}
      />
      <Image
        src={post.coverImage}
        alt="some ai generated image i dunno"
        width={384}
        height={384}
        className="w-96 h-96 self-center p-4"
      />
      <section className="flex flex-col md:flex-row py-4">
        <div className="flex flex-col w-2/3 md:w-1/4 font-medium divide-y place-self-center md:place-self-start">
          <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 pb-4">
            <h2>Tags</h2>
            <p className="text-sm">{post.category}</p>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 py-6">
            <h2>Read Time:</h2>
            <p className="text-sm">{post.readTime} Min</p>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 py-6">
            <h2>Date Published:</h2>
            <p className="text-sm">{postDate}</p>
          </div>
        </div>
        <article className="prose p-4 dark:prose-invert dark:prose-hotpink">
          <MDXContent />
        </article>
      </section>
    </div>
  );
};

export default PostPage;
