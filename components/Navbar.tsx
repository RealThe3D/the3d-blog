"use client";
import Link from "next/link";
import { FaGithub, FaMoon, FaSun } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  let button = (
    <button onClick={changeTheme} aria-label="Theme switcher">
      {theme == "light" ? <FaMoon size={24} /> : <FaSun size={24} />}
    </button>
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  function changeTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  if (!mounted) {
    button = <button className="invisible w-6 h-6"></button>;
  }
  return (
    <nav className="flex justify-between items-center p-4">
      <div className="flex items-center font-bold">
        <Link href="/" className="hover:underline dark:text-gray-200">
          Home
        </Link>
        <Link href="/posts" className="hover:underline ml-4 dark:text-gray-200">
          Posts
        </Link>
      </div>
      <div className="flex items-center font-bold space-x-10">
        <Link href="https://github.com/3DNinja54/the3d-blog">
          <button className="flex flex-row bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-md">
            GitHub
            <FaGithub size={24} className="ml-4" />
          </button>
        </Link>
        {button}
      </div>
    </nav>
  );
};
export default Navbar;
