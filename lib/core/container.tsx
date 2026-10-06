import type { HTMLAttributes, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import DrawBorder from "../utils/draw-border";
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
    "border-[3px] border-border bg-paper text-txt",

    // Disabled state and reduced motion
    "motion-reduce:transition-none",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: "bg-main text-main-txt",
        secondary: "bg-mint text-txt",
        outline: "bg-paper text-txt",
      },
      size: {
        sm: "p-4 text-sm",
        md: "p-5 text-base sm:p-6",
        lg: "p-8 text-lg",
      },
      direction: {
        row: "flex-row",
        column: "flex-col",
      },
      align: {
        start: "items-start",
        center: "items-center",
        end: "items-end",
        stretch: "items-stretch",
      },
      justify: {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
        between: "justify-between",
      },
      gap: {
        none: "gap-0",
        sm: "gap-3",
        md: "gap-5",
        lg: "gap-8",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "md",
      direction: "column",
      align: "stretch",
      justify: "start",
      gap: "md",
      fullWidth: false,
    },
  },
);

// Container props
export type ContainerProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof containerStyles> & {
    title: string;
    animate?: AnimationTrigger;
    shadow?: boolean;
    popDirection?: "out" | "in";
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
  fullWidth,
  animate = false,
  shadow = false,
  popDirection = "out",
  ...props
}: ContainerProps) {
  const { ref, shouldAnimate } = useAnimationTrigger<HTMLDivElement>(animate);

  // Wrapper classes
  const wrapperClasses = [
    // Layout and stacking
    "relative isolate",

    // Full width
    fullWidth ? "flex w-full" : "inline-flex w-fit",

    // Shadow
    shadow && 'before:pointer-events-none before:absolute before:inset-0 before:z-0 before:content-[""]',
    shadow && "before:translate-x-[var(--shadow-offset-x)]",
    shadow && "before:translate-y-[var(--shadow-offset-y)]",
    shadow && "before:bg-[var(--shadow-color)]",

    // Animation
    shouldAnimate && "animate-brutal-pop",
  ]
    .filter(Boolean)
    .join(" ");

  // Main return
  return (
    <div ref={ref} className={wrapperClasses} data-pop-direction={popDirection}>
      <section
        className={twMerge(
          containerStyles({
            variant,
            size,
            direction,
            align,
            justify,
            gap,
            fullWidth,
          }),
          shouldAnimate && "brutal-pop-face",
          className,
        )}
        {...props}
      >
        {/* Border */}
        <DrawBorder animate={shouldAnimate} className="z-10" />
        {/* Title */}
        <h2 className="relative z-10 font-display text-2xl font-bold">
          {title}
        </h2>
        {/* Children */}
        {children}
      </section>
    </div>
  );
}
