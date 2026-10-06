import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import DrawBorder from "../utils/draw-border";
import {
  useAnimationTrigger,
  type AnimationTrigger,
} from "../utils/use-enter-viewport";

// Badge styles
const badgeStyles = cva(
  [
    // Layout and stacking
    "relative z-10 isolate inline-flex w-fit self-center items-center justify-center",

    // Border and typography. Color matches the drawn stroke.
    "border-[3px] border-none text-center font-mono text-xs font-bold uppercase",

    // Disabled state and reduced motion
    "motion-reduce:transition-none",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: "bg-chart-1 text-main-foreground",
        secondary: "bg-chart-3 text-main-foreground",
        outline: "bg-secondary-background text-foreground",
      },
      size: {
        sm: "px-2 py-1",
        md: "px-3 py-1.5",
        lg: "px-4 py-2 text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "sm",
    },
  },
);

// Badge props
export type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeStyles> & {
    animate?: AnimationTrigger;
    rounded?: boolean;
  };

// Main Badge component
export default function Badge({
  children,
  className,
  variant,
  size,
  animate = false,
  rounded = false,
  ...props
}: BadgeProps) {
  // Animation trigger
  const { ref, shouldAnimate } = useAnimationTrigger<HTMLSpanElement>(animate);

  // Main return
  return (
    <span
      ref={ref}
      className={twMerge(
        badgeStyles({ variant, size }),
        rounded && "rounded-[var(--radius)]",
        className,
      )}
      {...props}
    >
      {/* Border */}
      <DrawBorder
        animate={shouldAnimate}
        radius={rounded ? "var(--radius)" : undefined}
        className="z-10"
      />
      {/* Children */}
      <span className="relative z-10">{children}</span>
    </span>
  );
}
