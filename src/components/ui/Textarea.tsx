// src/components/ui/Textarea.tsx
import { ComponentProps, useState, ReactNode } from 'react';

type TextareaProps = ComponentProps<'textarea'> & {
  label: string;
};

export function Textarea({ label, ...props }: TextareaProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!props.value);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false);
    setHasValue(!!e.target.value);
  };

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    setHasValue(!!e.currentTarget.value);
    props.onChange?.(e); // Propaga o evento onChange se existir
  };
  
  // Atualiza 'hasValue' se o valor for controlado externamente
  if (props.value && !hasValue) {
    setHasValue(true);
  }

  const isLabelActive = isFocused || hasValue;

  return (
    <div className="relative">
      <label
        className={`absolute transition-all duration-300 pointer-events-none ${
          isLabelActive
            ? 'top-[-0.75rem] left-2 bg-dark-surface px-1 text-xs text-accent'
            : `top-4 left-4 -translate-y-0 text-dark-subtle`
        }`}
      >
        {label}
      </label>
      <textarea
        onFocus={handleFocus}
        onBlur={handleBlur}
        onInput={handleInput}
        className="w-full bg-transparent border-2 border-dark-surface rounded-lg p-3 text-dark-text focus:outline-none focus:border-accent min-h-[120px]"
        {...props}
      />
    </div>
  );
}