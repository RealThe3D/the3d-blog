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
    <div className="flex flex-col w-full">
      <div className="flex flex-row p-6">
        <Image
          src={post.coverImage}
          alt="profile picture"
          width={128}
          height={128}
          className="mr-3 w-32 h-32"
        />
        <div className="flex flex-col">
          <Link href={post.url} className="font-bold text-xl">
            {post.title}
          </Link>
          <span className="text-gray-500"> {post.description}</span>
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
      </div>
    </div>
  );
};

export default PostCard;
