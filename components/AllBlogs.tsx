import { compareDesc } from "date-fns";
import { posts } from "@/.velite";
import PostCard from "./PostCard";

interface AllBlogsProps {
  size?: number;
}
const AllBlogs = ({ size }: AllBlogsProps) => {
  const allPosts = posts
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
    .slice(0, size);
  return (
    <div className="flex flex-col items-center mx-auto w-full space-y-2">
      <h2 className="text-3xl font-extrabold">Posts</h2>
      {allPosts.map((post, idx) => (
        <PostCard key={idx} {...post} />
      ))}
    </div>
  );
};

export default AllBlogs;
