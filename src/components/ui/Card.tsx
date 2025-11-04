// src/components/ui/Card.tsx
import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type CardProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
  className?: string;
};

// Variantes de animação padrão para os cards
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function Card({ children, className = "", ...props }: CardProps) {
  // Verificamos se o card já tem variantes, senão, usamos a padrão.
  const variants = props.variants || cardVariants;

  return (
    <motion.div
      // Aplicamos as variantes
      variants={variants}
      // Removemos initial/animate daqui, pois serão controlados pelo 'LayoutGroup' ou 'AnimatePresence' no componente pai
      
      // 👇 ESTILOS ATUALIZADOS PARA O EFEITO "GLASS"
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