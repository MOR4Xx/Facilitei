import { motion } from 'framer-motion';
import { ComponentProps, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = ComponentProps<'button'> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-hover',
  secondary: 'bg-accent text-dark-background hover:bg-accent-hover',
  outline: 'bg-transparent border border-primary text-primary hover:bg-primary hover:text-white',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  const baseStyle =
    'font-bold rounded-lg transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-accent/50 disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}