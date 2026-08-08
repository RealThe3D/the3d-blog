"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { FaAngleLeft } from "react-icons/fa";

const MotionLink = motion.create(Link);

const BackToPosts = () => {
  return (
    <MotionLink
      className="inline-flex origin-left flex-row items-center gap-2 text-sm text-stone-450 no-underline transition-colors hover:text-black dark:hover:text-white"
      href="/"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <FaAngleLeft />
      Back to posts
    </MotionLink>
  );
};

export default BackToPosts;
