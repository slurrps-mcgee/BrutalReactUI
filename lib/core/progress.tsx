import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import DrawBorder from "../utils/draw-border";
import {
  borderPaintClass,
  faceRadiusClass,
} from "../utils/surface";
import {
  useAnimationTrigger,
  type AnimationTrigger,
} from "../utils/use-enter-viewport";

// Progress track styles
const progressStyles = cva(
  [
    // Layout, border, and fill
    "relative w-full bg-secondary-background",
  ].join(" "),
  {
    variants: {
      // Track height
      size: {
        sm: "h-4",
        md: "h-6",
        lg: "h-9",
      },
      // Optional radius on the track
      rounded: {
        true: "rounded-[var(--radius)]",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      rounded: false,
    },
  },
);

// Indicator styles
const indicatorStyles = cva(
  [
    // Fill grows with the value.
    "h-full min-w-0 transition-[width] duration-300 ease-out",

    // Reduced motion
    "motion-reduce:transition-none motion-reduce:animate-none",
  ].join(" "),
  {
    variants: {
      // Fill
      variant: {
        primary: "bg-main",
        secondary: "bg-chart-2",
        success: "bg-success",
        warning: "bg-warning",
        danger: "bg-danger",
        info: "bg-info",
      },
      // Unknown value slides a short bar.
      indeterminate: {
        true: "w-1/3 animate-pulse",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      indeterminate: false,
    },
  },
);

export type ProgressProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> &
  VariantProps<typeof progressStyles> & {
    variant?: VariantProps<typeof indicatorStyles>["variant"];
    value?: number;
    max?: number;
    label?: string;
    showValue?: boolean;
    shadow?: boolean;
    border?: boolean;
    animate?: AnimationTrigger;
    disabled?: boolean;
    wrapperClassName?: string;
    faceClassName?: string;
    indicatorClassName?: string;
  };

export default function Progress({
  value,
  max = 100,
  label = "Progress",
  showValue = false,
  shadow = true,
  border = true,
  animate = false,
  disabled = false,
  wrapperClassName,
  faceClassName,
  className,
  indicatorClassName,
  variant,
  size,
  rounded,
  ...props
}: ProgressProps) {
  const safeMax = Number.isFinite(max) && max > 0 ? max : 100;
  const indeterminate = value === undefined;
  const safeValue = indeterminate
    ? undefined
    : Math.min(safeMax, Math.max(0, Number.isFinite(value) ? value : 0));
  const percentage =
    safeValue === undefined ? undefined : (safeValue / safeMax) * 100;
  const { ref, shouldAnimate } = useAnimationTrigger<HTMLDivElement>(animate);

  return (
    <div
      ref={ref}
      className={twMerge(
        [
          // Layout and stacking
          "relative isolate w-full",

          // Hard offset. A flat track stays put.
          shadow && "shadow-[var(--shadow)]",
          rounded && "rounded-[var(--radius)]",

          // Disabled state
          disabled && "pointer-events-none opacity-70",

          // Animation
          shouldAnimate && "animate-brutal-pop",
          wrapperClassName,
        ]
          .filter(Boolean)
          .join(" "),
      )}
      data-pop-direction="out"
    >
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={safeValue}
        aria-valuetext={
          percentage === undefined ? "Loading" : `${Math.round(percentage)}%`
        }
        className={twMerge(
          [
            progressStyles({ size }),

            // Pop target. Must be the wrapper's direct child.
            shouldAnimate && "brutal-pop-face",

            // Drawn stroke, or the resting border. border false drops both.
            shouldAnimate && border ? "border-none" : borderPaintClass(border),
            faceRadiusClass(rounded === true),
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
            radius={rounded === true ? "var(--radius)" : undefined}
            className="z-10"
          />
        )}
        <div
          className={twMerge(
            "h-full overflow-hidden",
            rounded &&
              "rounded-[max(0px,calc(var(--radius)-var(--border-width)))]",
          )}
        >
          <div
            aria-hidden="true"
            className={twMerge(
              indicatorStyles({ variant, indeterminate }),
              indicatorClassName,
            )}
            style={
              percentage === undefined ? undefined : { width: `${percentage}%` }
            }
          />
          {showValue && percentage !== undefined && (
            <span className="absolute inset-0 flex items-center justify-center font-mono text-xs font-bold">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
