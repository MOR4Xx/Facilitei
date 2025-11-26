import { type ComponentProps } from "react";

type InputProps = ComponentProps<"input"> & {
  label?: string;
  name: string;
};

export function Input({ label, name, className = "", ...props }: InputProps) {
  return (
    <div className="relative w-full group">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-dark-subtle mb-1.5 transition-colors group-focus-within:text-accent"
        >
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        className={`
          w-full bg-dark-surface/50 border-2 border-white/10 rounded-xl px-4 py-3
          text-white placeholder-dark-subtle/30
          transition-all duration-300 ease-out
          focus:outline-none focus:border-accent focus:bg-dark-surface focus:shadow-[0_0_15px_rgba(163,230,53,0.15)]
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      />
    </div>
  );
}
