import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

// Spinner styles
const spinnerStyles = cva(
  [
    // Layout. The ring is a full circle with one gap.
    "inline-block shrink-0 rounded-full border-[length:var(--border-width)] border-current",

    // Spin. One side stays clear so the motion reads.
    "border-r-transparent animate-spin",

    // Reduced motion
    "motion-reduce:animate-none",
  ].join(" "),
  {
    variants: {
      // Ink
      variant: {
        primary: "text-main",
        secondary: "text-chart-2",
        success: "text-success",
        warning: "text-warning",
        danger: "text-danger",
        info: "text-info",
        current: "text-current",
      },
      // Diameter and stroke
      size: {
        sm: "size-4 border-2",
        md: "size-6",
        lg: "size-10 border-4",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export type SpinnerProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof spinnerStyles> & {
    label?: string;
    rounded?: boolean;
    disabled?: boolean;
  };

export default function Spinner({
  className,
  variant,
  size,
  label = "Loading",
  rounded = false,
  disabled = false,
  ...props
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-live="polite"
      aria-label={label}
      aria-disabled={disabled || undefined}
      className={twMerge(
        [
          // Layout
          "inline-flex items-center",
          rounded && "rounded-[var(--radius)]",

          // Disabled state
          disabled && "pointer-events-none opacity-70",
          className,
        ]
          .filter(Boolean)
          .join(" "),
      )}
      {...props}
    >
      <span aria-hidden="true" className={spinnerStyles({ variant, size })} />
      <span className="sr-only">{label}</span>
    </span>
  );
}
