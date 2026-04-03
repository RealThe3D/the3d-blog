import { compareDesc } from "date-fns";
import { posts } from "@/.velite";
import Divider from "./Divider";
import PostCard from "./PostCard";

interface AllBlogsProps {
  size?: number;
}
const AllBlogs = ({ size }: AllBlogsProps) => {
  const allPosts = posts
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
    .slice(0, size);

  return (
    <section className="max-w-3xl p-6 mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <span className="leading-[1.7] text-xl">Posts</span>
        <Divider />
        <span className="text-slate-500 dark:text-stone-450 text-sm">
          {posts.length} Posts
        </span>
      </div>
      <div className="max-w-3xl mx-auto flex flex-col gap-2">
        {allPosts.map((post, idx) => (
          <PostCard key={idx} {...post} />
        ))}
      </div>
    </section>
  );
};

export default AllBlogs;
