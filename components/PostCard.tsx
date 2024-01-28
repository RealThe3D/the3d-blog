import Image from "next/image";
import { Post } from "contentlayer/generated";
import Link from "next/link";
import { addMinutes, format } from "date-fns";
import { FaArrowRight } from "react-icons/fa";

const PostCard = (post: Post) => {
  const postDate = format(
    addMinutes(new Date(post.date), new Date(post.date).getTimezoneOffset()),
    "MMMM d, yyyy"
  );
  return (
    <div className="flex flex-col w-full border-gray-300 dark:border-gray-700 border rounded-md py-2 md:py-0">
      <div className="flex flex-row pl-6 justify-between items-center h-auto">
        <div className="flex flex-col flex-wrap w-3/4">
          <Link href={post.url} className="font-bold text-xl">
            {post.title}
          </Link>
          <span className="text-gray-500 mb-1">{post.description}</span>
          <div className="text-sm w-fit text-gray-500 font-medium">
            <span>
              {post.categories[0]} &#8226; {postDate}
            </span>
          </div>
          <Link className="text-blue-600" href={post.url}>
            <span className="flex items-center space-x-2">
              <span>Read More</span>
              <FaArrowRight />
            </span>
          </Link>
        </div>
        <Image
          src={post.coverImage}
          alt="profile picture"
          width={256}
          height={256}
          className="w-32 h-32 place-self-end postcard-img rounded-r-md hidden md:block"
        />
      </div>
    </div>
  );
};

export default PostCard;
