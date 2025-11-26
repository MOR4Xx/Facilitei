import { type ComponentProps } from "react";

type TextareaProps = ComponentProps<"textarea"> & {
  label?: string;
  name: string;
};

export function Textarea({
  label,
  name,
  className = "",
  ...props
}: TextareaProps) {
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
      <textarea
        id={name}
        name={name}
        className={`
          w-full bg-dark-surface/50 border-2 border-white/10 rounded-xl px-4 py-3
          text-white placeholder-dark-subtle/30 min-h-[120px] resize-y
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
