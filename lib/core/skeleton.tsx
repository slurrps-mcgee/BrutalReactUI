import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const skeletonStyles = cva(
  [
    "relative overflow-hidden bg-disabled",
    "before:absolute before:inset-0",
    "before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)]",
    "before:bg-[length:200%_100%]",
    "motion-reduce:animate-none motion-reduce:before:animate-none",
  ].join(" "),
  {
    variants: {
      variant: {
        text: "h-[1em] w-full",
        rectangular: "min-h-24 w-full",
        circular: "aspect-square rounded-full",
      },
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
  };

export default function Skeleton({
  className,
  variant,
  animation,
  label = "Loading",
  rounded = false,
  ...props
}: SkeletonProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={twMerge(
        skeletonStyles({ variant, animation }),
        rounded && variant !== "circular" && "rounded-[var(--radius)]",
        className,
      )}
      {...props}
    >
      <span className="sr-only">{label}</span>
    </div>
  );
}
