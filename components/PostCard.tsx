import { addMinutes, format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/.velite";
import Divider from "@/components/Divider";

const PostCard = (post: Post) => {
  const postDate = format(
    addMinutes(new Date(post.date), new Date(post.date).getTimezoneOffset()),
    "MMMM d, yyyy",
  );
  return (
    <Link href={`/posts/${post.slug}`}>
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col gap-2 py-5">
          <div className="flex flex-row gap-2.5 text-xs items-center">
            <span className="uppercase">{post.categories[0]}</span> &#8226;{" "}
            <span className="text-stone-450">{postDate}</span>
          </div>
          <h2 className="text-lg">{post.title}</h2>
          <p className="text-sm text-stone-450">{post.description}</p>
        </div>
        <Image
          src={post.cover}
          alt="ai generated post cover image"
          width={80}
          height={80}
          className="w-20 h-20 rounded-md hidden md:block"
        />
      </div>
      <Divider />
    </Link>
  );
};

export default PostCard;
