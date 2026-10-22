import type { HTMLAttributes, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import DrawBorder from "../utils/draw-border";
import { borderPaintClass, faceRadiusClass } from "../utils/surface";
import {
  useAnimationTrigger,
  type AnimationTrigger,
} from "../utils/use-enter-viewport";

// Container styles
const containerStyles = cva(
  [
    // Layout and stacking
    "relative z-10 isolate flex",

    // Border and typography
    "bg-secondary-background text-foreground",

    // Disabled state and reduced motion. Gray communicates that it cannot be used.
    "aria-disabled:pointer-events-none aria-disabled:bg-disabled aria-disabled:text-disabled-foreground",
    "motion-reduce:transition-none",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          // Fill and ink
          "bg-secondary-background text-foreground",

          // Surface for outline children. Hover slide stays main.
          "[--surface:var(--secondary-background)] [--surface-foreground:var(--foreground)] [--outline-button-fill:var(--main)]",
        ].join(" "),
        secondary: [
          // Fill and ink
          "bg-chart-2 text-main-foreground",

          // Surface for outline children. Hover slide stays main.
          "[--surface:var(--chart-2)] [--surface-foreground:var(--main-foreground)] [--outline-button-fill:var(--main)]",
        ].join(" "),
        outline: [
          // Cut out of the parent surface and ink.
          "bg-[var(--surface)] text-[var(--surface-foreground)]",
        ].join(" "),
      },
      // Padding and type size
      size: {
        sm: "p-4 text-sm",
        md: "p-5 text-base sm:p-6",
        lg: "p-8 text-lg",
      },
      // Flex direction
      direction: {
        row: "flex-row",
        column: "flex-col",
      },
      // Cross-axis alignment
      align: {
        start: "items-start",
        center: "items-center",
        end: "items-end",
        stretch: "items-stretch",
      },
      // Main-axis alignment
      justify: {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
        between: "justify-between",
      },
      // Space between children
      gap: {
        none: "gap-0",
        sm: "gap-3",
        md: "gap-5",
        lg: "gap-8",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      direction: "column",
      align: "stretch",
      justify: "start",
      gap: "md",
    },
  },
);

// Container props
export type ContainerProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof containerStyles> & {
    title?: string;
    animate?: AnimationTrigger;
    fluid?: boolean;
    shadow?: boolean;
    border?: boolean;
    rounded?: boolean;
    disabled?: boolean;
    wrapperClassName?: string;
    faceClassName?: string;
    children?: ReactNode;
  };

// Main Container component
export default function Container({
  title,
  children,
  className,
  variant,
  size,
  direction,
  align,
  justify,
  gap,
  animate = false,
  fluid = false,
  shadow = true,
  border = true,
  rounded = false,
  disabled = false,
  wrapperClassName: wrapperClassNameProp,
  faceClassName,
  ...props
}: ContainerProps) {
  const { ref, shouldAnimate } = useAnimationTrigger<HTMLDivElement>(animate);
  // Wrapper classes. fluid fills the parent. Otherwise the section stops at 7xl.
  const wrapperClassName = twMerge(
    [
      // Layout and stacking. The face fills this box.
      "relative isolate flex w-full",
      fluid ? "" : "mx-auto max-w-7xl",

      // Hard offset. A flat face stays put.
      shadow && "shadow-[var(--shadow)]",
      rounded && "rounded-[var(--radius)]",

      // Animation
      shouldAnimate && "animate-brutal-pop",
    ]
      .filter(Boolean)
      .join(" "),
    wrapperClassNameProp,
  );

  // Main return
  return (
    <div ref={ref} className={wrapperClassName} data-pop-direction="out">
      <section
        className={twMerge(
          [
            containerStyles({
              variant,
              size,
              direction,
              align,
              justify,
              gap,
            }),
            "w-full",

            // Drawn stroke, or the resting border. border false drops both.
            shouldAnimate && border ? "border-none" : borderPaintClass(border),

            // Pop target. Must be the wrapper's direct child.
            shouldAnimate && "brutal-pop-face",
            faceRadiusClass(rounded),
            faceClassName,
            className,
          ]
            .filter(Boolean)
            .join(" "),
        )}
        aria-disabled={disabled || undefined}
        {...props}
      >
        {shouldAnimate && border && (
          <DrawBorder
            animate
            radius={rounded ? "var(--radius)" : undefined}
            className="z-10"
          />
        )}
        {/* Section title */}
        <h2 className="relative z-10 font-display text-2xl font-bold">
          {title}
        </h2>
        {children}
      </section>
    </div>
  );
}
