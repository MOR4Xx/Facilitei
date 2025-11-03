// src/components/ui/Textarea.tsx
import { ComponentProps } from 'react';

type TextareaProps = ComponentProps<'textarea'> & {
  label: string;
  name: string;
};

// =================================================================
//  MUDANÇA ZIKA: Label inicial com 'text-primary' (verde fraco)
// =================================================================

export function Textarea({ label, name, ...props }: TextareaProps) {
  return (
    <div className="relative w-full">
      {/* 1. Label com cor 'text-primary' por padrão */}
      <label
        htmlFor={name}
        className="block text-sm font-medium text-primary mb-2 transition-colors duration-300
                   peer-focus:text-accent" // 👈 Foco muda para 'accent'
      >
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        className={`
          peer
          w-full 
          bg-dark-surface/50 
          border-2 
          border-dark-surface 
          rounded-lg 
          p-3 
          text-dark-text 
          placeholder-dark-subtle/50
          transition-all duration-300
          focus:outline-none 
          focus:border-accent 
          focus:bg-dark-surface 
          focus:shadow-glow-accent/50
          min-h-[120px]
        `}
        {...props}
      />
    </div>
  );
}
// =================================================================
//  FIM DA MUDANÇA
// =================================================================  