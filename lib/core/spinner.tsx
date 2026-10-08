import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const spinnerStyles = cva(
  [
    "inline-block shrink-0 rounded-full border-[3px] border-current",
    "border-r-transparent animate-spin motion-reduce:animate-none",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: "text-main",
        secondary: "text-chart-2",
        success: "text-success",
        warning: "text-warning",
        danger: "text-danger",
        info: "text-info",
        current: "text-current",
      },
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
  };

export default function Spinner({
  className,
  variant,
  size,
  label = "Loading",
  ...props
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-live="polite"
      aria-label={label}
      className={twMerge("inline-flex items-center", className)}
      {...props}
    >
      <span aria-hidden="true" className={spinnerStyles({ variant, size })} />
      <span className="sr-only">{label}</span>
    </span>
  );
}
