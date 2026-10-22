import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

// Skeleton styles
const skeletonStyles = cva(
  [
    // Layout and fill
    "relative overflow-hidden bg-disabled",

    // Shimmer band
    "before:absolute before:inset-0",
    "before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)]",
    "before:bg-[length:200%_100%]",

    // Reduced motion
    "motion-reduce:animate-none motion-reduce:before:animate-none",
  ].join(" "),
  {
    variants: {
      // Shape
      variant: {
        text: "h-[1em] w-full",
        rectangular: "min-h-24 w-full",
        circular: "aspect-square rounded-full",
      },
      // Motion. Wave uses the shimmer. Pulse and none hide it.
      animation: {
        pulse: "animate-pulse before:hidden",
        wave: "before:animate-[pulse_1.5s_ease-in-out_infinite]",
        none: "before:hidden",
      },
    },
    defaultVariants: {
      variant: "text",
      animation: "pulse",
    },
  },
);

export type SkeletonProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof skeletonStyles> & {
    label?: string;
    rounded?: boolean;
    disabled?: boolean;
  };

export default function Skeleton({
  className,
  variant,
  animation,
  label = "Loading",
  rounded = false,
  disabled = false,
  ...props
}: SkeletonProps) {
  return (
    <div
      role="status"
      aria-label={label}
      aria-disabled={disabled || undefined}
      className={twMerge(
        [
          skeletonStyles({ variant, animation }),

          // Radius. A circle already has its own shape.
          rounded && variant !== "circular" && "rounded-[var(--radius)]",

          // Disabled state
          disabled && "pointer-events-none opacity-70",
          className,
        ]
          .filter(Boolean)
          .join(" "),
      )}
      {...props}
    >
      <span className="sr-only">{label}</span>
    </div>
  );
}
