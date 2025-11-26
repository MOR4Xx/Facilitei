import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type CardProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
  className?: string;
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function Card({ children, className = "", ...props }: CardProps) {
  const variants = props.variants || cardVariants;

  return (
    <motion.div
      variants={variants}
      
      className={`
        bg-dark-surface/70 
        backdrop-blur-lg 
        rounded-xl 
        border border-primary/20
        transition-all duration-300
        hover:border-primary/40
        hover:shadow-glow-primary
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
}