"use client";
import Link from "next/link";
import { FaMoon, FaSun } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  function changeTheme() {
    theme === "light" ? setTheme("dark") : setTheme("light");
  }
  if (!mounted) {
    return (
      <nav className="flex justify-between items-center p-4">
        <div className="flex items-center font-bold">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/posts" className=" hover:underline ml-4">
            Posts
          </Link>
        </div>
      </nav>
    );
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
      <button onClick={changeTheme}>
        {theme == "light" ? <FaMoon size={24} /> : <FaSun size={24} />}
      </button>
    </nav>
  );
};
export default Navbar;
