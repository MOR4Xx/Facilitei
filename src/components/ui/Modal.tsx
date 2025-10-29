// src/components/ui/Modal.tsx
import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

// Animação para o "backdrop" (fundo escuro)
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

// Animação para o modal (dialog)
const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 50 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } },
  exit: { opacity: 0, scale: 0.9, y: 50, transition: { duration: 0.2 } },
};

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-dark-background/80 backdrop-blur-sm z-40 flex justify-center items-center"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose} // Fecha o modal ao clicar no fundo
        >
          <motion.div
            className="bg-dark-surface w-full max-w-lg p-8 rounded-xl shadow-glow-primary border border-primary/20 z-50"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()} // Impede o fechamento ao clicar dentro do modal
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-dark-text">{title}</h2>
              <button 
                onClick={onClose} 
                className="text-dark-subtle hover:text-accent transition-colors text-2xl"
              >
                &times;
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}