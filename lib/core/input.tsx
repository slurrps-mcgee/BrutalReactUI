import type { InputHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const inputStyles = cva(
  [
    "relative z-10 w-full border-[3px] border-border font-mono",
    "transition-transform duration-150",
    "translate-x-[var(--shadow-offset-x)]",
    "translate-y-[var(--shadow-offset-y)]",
    "transition-transform duration-150",
    "focus:translate-x-0",
    "focus:translate-y-0",
    "focus:z-20 focus-visible:outline-none",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "motion-reduce:transition-none",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "bg-paper text-main-txt dark:text-txt placeholder:text-sub-txt",
        secondary: "bg-paper text-txt placeholder:text-sub-txt",
        outline: "bg-background text-foreground placeholder:text-sub-txt",
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

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> &
  VariantProps<typeof inputStyles> & {
    wrapperClassName?: string;
  };

export default function Input({
  className,
  wrapperClassName,
  variant,
  size,
  ...inputProps
}: InputProps) {
  return (
    <div
      className={["flex w-full items-center", wrapperClassName]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="relative isolate w-full">
        <div
          aria-hidden="true"
          className={[
            "pointer-events-none absolute inset-0 z-0",
            "translate-x-[var(--shadow-offset-x)] translate-y-[var(--shadow-offset-y)]",
            "bg-[var(--shadow-color)]",
          ].join(" ")}
        />
        <input
          className={inputStyles({ variant, size, className })}
          {...inputProps}
        />
      </div>
    </div>
  );
}
