// src/components/ui/Card.tsx
import { motion, type HTMLMotionProps } from 'framer-motion'; // 👈 IMPORTE HTMLMotionProps
import type { ReactNode } from 'react'; // 👈 Removido 'ComponentProps'

// 👇 A MUDANÇA ESTÁ AQUI
// Use HTMLMotionProps<'div'> que já inclui 'children', 'className' e todas as props de div
type CardProps = HTMLMotionProps<'div'> & {
  // Você pode adicionar props customizadas aqui se precisar,
  // mas 'children' e 'className' já estão incluídos em HTMLMotionProps
  children: ReactNode; // Mantido para clareza
  className?: string; // Mantido para clareza
};

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{
        y: -5,
        boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)',
      }}
      className={`bg-dark-surface p-6 rounded-xl border border-transparent hover:border-accent/50 transition-all duration-300 ${className}`}
      {...props} // 👈 Agora 'props' corresponde perfeitamente ao que motion.div espera
    >
      {children}
    </motion.div>
  );
}