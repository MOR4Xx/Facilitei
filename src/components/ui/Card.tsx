// src/components/ui/Card.tsx
import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type CardProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{
        y: -5,
        boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
      }}
      className={`bg-dark-surface p-6 rounded-xl border border-transparent hover:border-accent/50 transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
