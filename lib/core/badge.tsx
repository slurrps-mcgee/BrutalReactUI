import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import DrawBorder from "../utils/draw-border";
import {
  borderPaintClass,
  faceRadiusClass,
  useSurfaceAnimate,
  useSurfaceDisabled,
  useSurfaceFlag,
} from "../utils/surface";
import {
  useAnimationTrigger,
  type AnimationTrigger,
} from "../utils/use-enter-viewport";

// Styles for the Badge component.
const badgeStyles = cva(
  [
    // Layout and stacking
    "relative z-10 isolate inline-flex w-fit self-center items-center justify-center",

    // Border and typography. Thinner than the shared stroke. The host sets --border-width.
    "text-center font-mono text-xs font-bold uppercase",

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
    border?: boolean;
    shadow?: boolean;
    disabled?: boolean;
    faceClassName?: string;
  };

// Main Badge component
export default function Badge({
  children,
  className,
  variant,
  size,
  animate: animateProp,
  rounded: roundedProp,
  border: borderProp,
  shadow: shadowProp,
  disabled: disabledProp,
  faceClassName,
  ...props
}: BadgeProps) {
  const animate = useSurfaceAnimate(animateProp);
  const rounded = useSurfaceFlag(roundedProp, "rounded", false);
  const border = useSurfaceFlag(borderProp, "border", true);
  // A badge stays flat unless this badge asks for a shadow.
  const shadow = shadowProp === true;
  const disabled = useSurfaceDisabled(disabledProp);
  const { ref, shouldAnimate } = useAnimationTrigger<HTMLSpanElement>(animate);

  // Main return
  return (
    <span
      ref={ref}
      data-pop-direction={shouldAnimate ? "out" : undefined}
      className={twMerge(
        [
          // Thinner stroke than the shared 3px chrome. The face inherits it.
          "relative inline-flex w-fit [--border-width:2px]",
          rounded && "rounded-[var(--radius)]",
          shadow && "shadow-[var(--shadow)]",
          shouldAnimate && "animate-brutal-pop",
          disabled && "pointer-events-none opacity-70",
        ]
          .filter(Boolean)
          .join(" "),
      )}
    >
      <span
        aria-disabled={disabled || undefined}
        className={twMerge(
          [
            badgeStyles({ variant, size }),

            // Drawn stroke, or the resting border. border false drops both.
            shouldAnimate && border ? "border-none" : borderPaintClass(border),
            shouldAnimate && "brutal-pop-face",
            faceRadiusClass(rounded),
            faceClassName,
            className,
          ]
            .filter(Boolean)
            .join(" "),
        )}
        {...props}
      >
        {shouldAnimate && border && (
          <DrawBorder
            animate
            radius={rounded ? "var(--radius)" : undefined}
            className="z-20"
          />
        )}
        {/* Children */}
        <span className="relative z-10">{children}</span>
      </span>
    </span>
  );
}
