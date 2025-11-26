import { type ReactNode } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.15 } },
};

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-dark-background/80 backdrop-blur-md z-50 flex justify-center items-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-lg bg-dark-surface border border-primary/20 rounded-2xl shadow-2xl overflow-hidden relative"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header com Gradiente Sutil */}
            <div className="px-6 py-5 border-b border-white/5 bg-gradient-to-r from-primary/5 to-transparent flex justify-between items-center">
              <h2 className="text-xl font-bold text-white tracking-tight">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-dark-subtle hover:bg-red-500/20 hover:text-red-500 transition-all"
              >
                &times;
              </button>
            </div>

            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
