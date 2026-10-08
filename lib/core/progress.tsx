import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import DrawBorder from "../utils/draw-border";
import {
  useAnimationTrigger,
  type AnimationTrigger,
} from "../utils/use-enter-viewport";

const progressStyles = cva(
  "relative w-full overflow-hidden border-[3px] border-border bg-secondary-background",
  {
    variants: {
      size: {
        sm: "h-4",
        md: "h-6",
        lg: "h-9",
      },
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

const indicatorStyles = cva(
  [
    "h-full min-w-0 transition-[width] duration-300 ease-out",
    "motion-reduce:transition-none motion-reduce:animate-none",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: "bg-main",
        secondary: "bg-chart-2",
        success: "bg-success",
        warning: "bg-warning",
        danger: "bg-danger",
        info: "bg-info",
      },
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
    animate?: AnimationTrigger;
    wrapperClassName?: string;
    faceClassName?: string;
    indicatorClassName?: string;
  };

export default function Progress({
  value,
  max = 100,
  label = "Progress",
  showValue = false,
  shadow = false,
  animate = false,
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
  const { ref, shouldAnimate } =
    useAnimationTrigger<HTMLDivElement>(animate);

  return (
    <div
      ref={ref}
      className={twMerge(
        "relative isolate w-full",
        shadow && "shadow-[var(--shadow)]",
        rounded && "rounded-[var(--radius)]",
        shouldAnimate && "animate-brutal-pop",
        wrapperClassName,
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
          progressStyles({ size, rounded }),
          shouldAnimate ? "border-none brutal-pop-face" : "border-border",
          faceClassName,
          className,
        )}
        {...props}
      >
        {shouldAnimate && (
          <DrawBorder
            animate
            radius={rounded ? "var(--radius)" : undefined}
            className="z-10"
          />
        )}
        <div
          aria-hidden="true"
          className={twMerge(
            indicatorStyles({ variant, indeterminate }),
            rounded && "rounded-[calc(var(--radius)-3px)]",
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
  );
}
