// src/components/ui/Input.tsx
import { ComponentProps, ReactNode } from 'react';

type InputProps = ComponentProps<'input'> & {
  label: string;
  icon?: ReactNode; // Ícone opcional
  name: string;
};

// =================================================================
//  MUDANÇA ZIKA: Borda 'primary' (verde fraco) por padrão
// =================================================================

export function Input({ label, type = 'text', icon, name, ...props }: InputProps) {
  const hasIcon = !!icon;

  return (
    <div className="relative w-full">
      {/* 1. Label (Verde fraco por padrão, muda no foco) */}
      <label
        htmlFor={name}
        className="block text-sm font-medium text-primary mb-2 transition-colors duration-300
                   peer-focus:text-accent"
      >
        {label}
      </label>

      {/* 2. Wrapper relativo para o ícone */}
      <div className="relative">
        {icon && (
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 text-primary
                             peer-focus:text-accent transition-colors duration-300"
          >
            {icon}
          </span>
        )}
        <input
          id={name}
          name={name}
          type={type}
          className={`
            peer 
            w-full 
            bg-dark-surface 
            border-2 
            border-primary/50 
            rounded-lg 
            p-3 
            text-dark-text 
            placeholder-dark-subtle/50
            transition-all duration-300
            focus:outline-none 
            focus:border-accent 
            focus:shadow-glow-accent/50
            ${hasIcon ? 'pl-10' : 'pl-4'}
          `} // 👆 MUDANÇAS AQUI: bg-dark-surface (sólido) e border-primary/50 (verde fraco)
          {...props}
        />
      </div>
    </div>
  );
}
// =================================================================
//  FIM DA MUDANÇA
// =================================================================