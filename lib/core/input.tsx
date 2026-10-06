import type { InputHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

// Input styles
const inputStyles = cva(
  [
    // Layout and stacking
    "relative z-10 w-full border-[3px] border-border font-mono",

    // Shadow
    "transition-transform duration-150",
    "translate-x-[var(--shadow-offset-x)]",
    "translate-y-[var(--shadow-offset-y)]",
    "transition-transform duration-150",
    "focus:translate-x-0",
    "focus:translate-y-0",
    "focus:z-20 focus-visible:outline-none",

    // Disabled state
    "disabled:cursor-not-allowed disabled:opacity-50",

    // Reduced motion
    "motion-reduce:transition-none",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "bg-secondary-background text-foreground placeholder:text-foreground/60",
        secondary:
          "bg-secondary-background text-foreground placeholder:text-foreground/60",
        outline: "bg-background text-foreground placeholder:text-foreground/60",
      },
      size: {
        sm: "px-3 py-2 text-xs",
        md: "px-4 py-3 text-sm",
        lg: "px-5 py-4 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

// Input props
export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> &
  VariantProps<typeof inputStyles> & {
    wrapperClassName?: string;
    rounded?: boolean;
  };

// Main Input component
export default function Input({
  className,
  wrapperClassName,
  variant,
  size,
  rounded = false,
  ...inputProps
}: InputProps) {
  // Wrapper classes
  const wrapperClasses = twMerge("flex w-full items-center", wrapperClassName);

  // Main return
  return (
    <div className={wrapperClasses}>
      <div className="relative isolate w-full">
        {/* Shadow plate. It uses the same translate as the field so the curve stays aligned. */}
        <div
          aria-hidden="true"
          className={twMerge(
            "pointer-events-none absolute inset-0 z-0 bg-[var(--shadow-color)]",
            "translate-x-[var(--shadow-offset-x)] translate-y-[var(--shadow-offset-y)]",
            rounded && "rounded-[var(--radius)]",
          )}
        />
        <input
          className={twMerge(
            inputStyles({ variant, size }),
            rounded && "rounded-[var(--radius)]",
            className,
          )}
          {...inputProps}
        />
      </div>
    </div>
  );
}
