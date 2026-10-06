import type { HTMLAttributes, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import DrawBorder from "../utils/draw-border";
import {
  useAnimationTrigger,
  type AnimationTrigger,
} from "../utils/use-enter-viewport";

// Card styles
const cardStyles = cva(
  [
    // Layout and stacking
    "relative z-10 isolate flex h-full w-full flex-col",

    // Border and typography. Color matches the drawn stroke.
    "border-[3px] border-border bg-paper text-txt border-none",

    // Press interaction
    "transition-transform duration-150",
    "hover:translate-x-[var(--shadow-offset-x)]",
    "hover:translate-y-[var(--shadow-offset-y)]",

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
        sm: "gap-3 p-4 text-sm",
        md: "gap-4 p-6 text-base",
        lg: "gap-6 p-8 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

// Card props
export type CardProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof cardStyles> & {
    animate?: AnimationTrigger;
    popDirection?: "out" | "in";
    children?: ReactNode;
  };

// Main Card component
export default function Card({
  children,
  className,
  variant,
  size,
  animate = false,
  popDirection = "out",
  ...props
}: CardProps) {
  // Animation trigger
  const { ref, shouldAnimate } = useAnimationTrigger<HTMLDivElement>(animate);

  // Wrapper classes
  const wrapperClasses = [
    // Layout and stacking
    "relative isolate h-full w-full",

    // Shadow
    'before:pointer-events-none before:absolute before:inset-0 before:z-0 before:content-[""]',
    "before:translate-x-[var(--shadow-offset-x)]",
    "before:translate-y-[var(--shadow-offset-y)]",
    "before:bg-[var(--shadow-color)]",

    // Animation
    shouldAnimate && "animate-brutal-pop",
  ]
    .filter(Boolean)
    .join(" ");

  // Main return
  return (
    <div ref={ref} className={wrapperClasses} data-pop-direction={popDirection}>
      <article
        className={twMerge(
          cardStyles({ variant, size }),
          shouldAnimate && "brutal-pop-face",
          className,
        )}
        {...props}
      >
        {/* Border */}
        <DrawBorder animate={shouldAnimate} className="z-30" />
        {/* Children */}
        {children}
      </article>
    </div>
  );
}

// Card Header component
export function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return <header className={className} {...props} />;
}

// Card Body component
export function CardBody({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={className} {...props} />;
}

// Card Footer component
export function CardFooter({
  className,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return <footer className={className} {...props} />;
}

// Card Image component
export function CardImage({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={["w-full", className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}
