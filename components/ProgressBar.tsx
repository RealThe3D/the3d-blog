"use client";

import { motion, useScroll } from "motion/react";

const ProgressBar = () => {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      style={{
        scaleX: scrollYProgress,
      }}
      className="z-101 h-0.5 bg-secondary fixed top-0 left-0 right-0 origin-left"
    ></motion.div>
  );
};

export default ProgressBar;
