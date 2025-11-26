import type { Variants } from 'framer-motion';

export const cardItemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 100 } },
};