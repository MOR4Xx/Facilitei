import { ComponentProps, useState, ReactNode } from 'react';

type InputProps = ComponentProps<'input'> & {
  label: string;
  icon?: ReactNode; // Ícone opcional
};

export function Input({ label, type = 'text', icon, ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setHasValue(!!e.target.value);
  };

  const isLabelActive = isFocused || hasValue;

  return (
    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-subtle">
          {icon}
        </span>
      )}
      <label
        className={`absolute transition-all duration-300 ${
          isLabelActive
            ? 'top-[-0.75rem] left-2 bg-dark-background px-1 text-xs text-accent'
            : `top-1/2 left-${icon ? '10' : '4'} -translate-y-1/2 text-dark-subtle`
        }`}
      >
        {label}
      </label>
      <input
        type={type}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`w-full bg-transparent border-2 border-dark-surface rounded-lg p-3 text-dark-text focus:outline-none focus:border-accent ${
          icon ? 'pl-10' : ''
        }`}
        {...props}
      />
    </div>
  );
}