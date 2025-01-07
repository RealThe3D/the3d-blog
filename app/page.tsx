import Image from "next/image";
import AllBlogs from "@/components/AllBlogs";

const Page = () => {
  return (
    <main className="flex xl:flex-row flex-col items-center xl:items-start xl:justify-between my-4">
      <div className="flex flex-col max-w-md xl:max-w-md 2xl:max-w-md place-items-center xl:place-items-start">
        <Image
          src="/proto_mirage_pfp.jpg"
          alt="profile picture"
          width={256}
          height={256}
          className="w-max rounded-full"
          priority
        />
        <div className="text-xl mt-2 font-bold">Hello, I&apos;m The3D.</div>
        <div className="place-self-center xl:place-self-start text-center xl:text-left">
          18 Years Old 🏌️‍♂️
          <br />
          Majoring in Computer Science and <br /> Electrical Engineering. 🎓
          <br />
          Class of MMXXV 😃
          <br />
          Soon Class of MMXIX in College! 🎓
        </div>
      </div>
      <div className="flex flex-col xl:mt-0 mt-4 mx-auto md:mx-20 items-center md:items-start">
        <div className="flex flex-col justify-center divide-y divide-grey-400">
          <AllBlogs />
        </div>
      </div>
    </main>
  );
};

export default Page;
