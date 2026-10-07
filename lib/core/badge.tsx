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

    // Border and typography. Thinner than the 3px stroke on buttons and cards.
    "border-2 text-center font-mono text-xs font-bold uppercase",

    // Disabled state and reduced motion
    "motion-reduce:transition-none",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          // Fill and ink
          "bg-chart-1 text-main-foreground",

          // Surface for outline children. Hover slide stays main.
          "[--surface:var(--chart-1)] [--surface-foreground:var(--main-foreground)] [--outline-button-fill:var(--main)]",
        ].join(" "),
        secondary: [
          // Fill and ink
          "bg-chart-3 text-main-foreground",

          // Surface for outline children. Hover slide stays main.
          "[--surface:var(--chart-3)] [--surface-foreground:var(--main-foreground)] [--outline-button-fill:var(--main)]",
        ].join(" "),
        success: [
          // Fill and ink
          "bg-success text-success-foreground",

          // Surface for outline children. Hover slide stays main.
          "[--surface:var(--success)] [--surface-foreground:var(--success-foreground)] [--outline-button-fill:var(--main)]",
        ].join(" "),
        warning: [
          // Fill and ink
          "bg-warning text-warning-foreground",

          // Surface for outline children. Hover slide stays main.
          "[--surface:var(--warning)] [--surface-foreground:var(--warning-foreground)] [--outline-button-fill:var(--main)]",
        ].join(" "),
        danger: [
          // Fill and ink
          "bg-danger text-danger-foreground",

          // Surface for outline children. Hover slide stays main.
          "[--surface:var(--danger)] [--surface-foreground:var(--danger-foreground)] [--outline-button-fill:var(--main)]",
        ].join(" "),
        info: [
          // Fill and ink
          "bg-info text-info-foreground",

          // Surface for outline children. Hover slide stays main.
          "[--surface:var(--info)] [--surface-foreground:var(--info-foreground)] [--outline-button-fill:var(--main)]",
        ].join(" "),
      },
      // Padding and type size
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
    faceClassName?: string;
  };

// Main Badge component
export default function Badge({
  children,
  className,
  variant,
  size,
  animate = false,
  rounded = false,
  faceClassName,
  ...props
}: BadgeProps) {
  // Animation trigger
  const { ref, shouldAnimate } = useAnimationTrigger<HTMLSpanElement>(animate);

  // Main return
  return (
    <span
      ref={ref}
      className={twMerge(
        [
          badgeStyles({ variant, size }),

          // Resting stroke, or none while the SVG draws it.
          shouldAnimate ? "border-none" : "border-border",
          rounded && "rounded-[var(--radius)]",
          faceClassName,
          className,
        ]
          .filter(Boolean)
          .join(" "),
      )}
      {...props}
    >
      {/* Border */}
      {shouldAnimate && (
          <DrawBorder
            animate
            strokeWidth={2}
            radius={rounded ? "var(--radius)" : undefined}
            className="z-10"
          />
      )}
      {/* Children */}
      <span className="relative z-10">{children}</span>
    </span>
  );
}
