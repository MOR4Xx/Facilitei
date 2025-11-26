import { motion, type HTMLMotionProps } from "framer-motion";
import { type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = HTMLMotionProps<"button"> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white shadow-glow-primary hover:bg-primary-hover border border-transparent",
  secondary:
    "bg-accent text-dark-background font-extrabold shadow-glow-accent hover:bg-accent-hover border border-transparent",
  outline:
    "bg-transparent border-2 border-primary/50 text-primary hover:bg-primary/10 hover:border-primary",
  ghost: "bg-transparent text-dark-subtle hover:text-white hover:bg-white/5",
  danger:
    "bg-status-danger/10 text-status-danger border border-status-danger/50 hover:bg-status-danger hover:text-white",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.96 }}
      className={`
        relative rounded-xl font-bold transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-background focus:ring-accent
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {children}
    </motion.button>
  );
}
