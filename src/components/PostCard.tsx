import type { Post } from "@/lib/postLoader";
import { addMinutes, format } from "date-fns";
import Divider from "@/components/Divider";
import { Link } from "@tanstack/react-router";

const PostCard = (post: Post) => {
  const postDate = format(
    addMinutes(
      new Date(post.frontmatter.date),
      new Date(post.frontmatter.date).getTimezoneOffset(),
    ),
    "MMMM d, yyyy",
  );

  return (
    <Link to={`/posts/${post.title}`}>
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col gap-2 py-5">
          <div className="flex flex-row gap-2.5 text-xs items-center">
            <span className="uppercase dark:text-cyan-400">
              {post.frontmatter.categories[0]}
            </span>
            &#8226; <span className="text-stone-450">{postDate}</span>
          </div>
          <h2 className="text-lg">{post.frontmatter.title}</h2>
          <p className="text-sm text-stone-450">
            {post.frontmatter.description}
          </p>
        </div>
        <img
          src={post.frontmatter.cover}
          alt="ai generated post cover"
          className="w-20 h-20 rounded-md hidden md:block"
        />
      </div>
      <Divider />
    </Link>
  );
};

export default PostCard;
