import { ClientOnly } from "@tanstack/react-router";
import { motion, useScroll } from "motion/react";

const ProgressBar = () => {
	const { scrollYProgress } = useScroll();
	return (
		<ClientOnly>
			<motion.div
				style={{
					scaleX: scrollYProgress,
				}}
				className="z-101 h-0.5 bg-cyan-400 fixed top-0 left-0 right-0 origin-left"
			></motion.div>
		</ClientOnly>
	);
};

export default ProgressBar;
