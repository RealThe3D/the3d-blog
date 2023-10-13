import { allPosts } from "@/.contentlayer/generated";
import { compareDesc } from "date-fns";
import PostCard from "./PostCard";

interface AllBlogsProps {
  size?: number;
}
const AllBlogs = ({ size }: AllBlogsProps) => {
  const posts = allPosts
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
    .slice(0, size);
  return (
    <div className="flex flex-col items-center divide-y divide-grey-400 mx-auto w-full">
      <h2 className="text-3xl font-extrabold">Posts</h2>
      {posts.map((post, idx) => (
        <PostCard key={idx} {...post} />
      ))}
    </div>
  );
};

export default AllBlogs;
