import Image from "next/image";

const Hero = () => {
  return (
    <section className="max-w-3xl flex mx-auto my-6 gap-9 p-10">
      <Image
        className="rounded-full w-20 h-20"
        src="/proto_mirage_pfp.jpg"
        alt="profile picture"
        width={80}
        height={80}
      />
      <div>
        <span className="uppercase dark:text-stone-450 text-sm tracking-wider">
          Personal blog
        </span>
        <h1 className="my-2 text-4xl tracking-tight leading-[1.7]">
          Hello, I&apos;m The3D.
        </h1>
        <p className="dark:text-stone-450 text-sm leading-[1.7]">
          College Student studying in Computer Science. I like tech, games, and
          other stuff. Soon to be Class of{" "}
          <span className="line-through mr-1">MMXXIX</span>
          MMXXVIII.
          {/* TODO: Add socials here. */}
        </p>
      </div>
    </section>
  );
};

export default Hero;
