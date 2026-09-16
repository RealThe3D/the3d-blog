import type { Post } from "@/lib/postLoader";
import Divider from "./Divider";
import PostCard from "./PostCard";

const AllBlogs = ({ posts }: { posts: Post[] }) => {
  return (
    <section className="max-w-3xl p-6 mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <span className="leading-[1.7] text-xl">Posts</span>
        <Divider />
        <span className="text-slate-500 dark:text-stone-450 text-sm">
          {posts.length === 1
            ? `${posts.length} Post`
            : `${posts.length} Posts`}
        </span>
      </div>
      <div className="max-w-3xl mx-auto flex flex-col gap-2">
        {posts.map((post) => (
          <PostCard key={post.title} {...post} />
        ))}
      </div>
    </section>
  );
};

export default AllBlogs;
