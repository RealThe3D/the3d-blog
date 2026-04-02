"use client";
import Link from "next/link";
import { FaGithub, FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "@/hooks/useTheme";

const Navbar = () => {
  const { theme, toggleTheme, mounted } = useTheme();
  let button = (
    <button onClick={toggleTheme} aria-label="Theme switcher">
      {theme === "light" ? <FaMoon size={24} /> : <FaSun size={24} />}
    </button>
  );

  if (!mounted) {
    button = <button className="invisible w-6 h-6"></button>;
  }
  return (
    // TODO: Add hover animations
    <nav className="flex items-center justify-between sticky top-0 border-b py-2 px-4 sm:py-6 sm:px-10 backdrop-blur-md z-100 bg-white/90 dark:bg-midnight border-gray-200 dark:border-white/10">
      <span className="text-gray-900 dark:text-gray-100">The3D</span>
      <div className="flex gap-3 sm:gap-7 text-gray-600 dark:text-gray-500 text-sm items-center">
        <Link className="hidden sm:block" href="/">
          Home
        </Link>
        <Link className="hidden sm:block" href="/posts">
          Posts
        </Link>
        <Link
          className="border border-gray-300 dark:border-gray-700 rounded-lg py-2 px-2 sm:px-3.5 flex items-center text-gray-700 dark:text-gray-300 gap-2"
          href="https://github.com/RealThe3D/the3d-blog"
        >
          <FaGithub />
          <span className="hidden sm:inline">GitHub</span>
        </Link>
        {button}
      </div>
    </nav>
  );
};

export default Navbar;
