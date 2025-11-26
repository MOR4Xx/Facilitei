import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

type AccordionItemProps = {
  title: string;
  children: ReactNode;
};

export function AccordionItem({ title, children }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/10 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left py-5 px-6 hover:bg-white/5 transition-colors group"
      >
        <span
          className={`text-lg font-medium transition-colors ${
            isOpen ? "text-accent" : "text-white group-hover:text-white/80"
          }`}
        >
          {title}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-accent"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 text-dark-subtle leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
