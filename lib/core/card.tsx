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
    "border-[3px] bg-secondary-background text-foreground",

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
        primary: [
          // Fill and ink
          "bg-main text-main-foreground",

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
      // Padding, gap, and type size
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
    rounded?: boolean;
    wrapperClassName?: string;
    faceClassName?: string;
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
  rounded = false,
  wrapperClassName: wrapperClassNameProp,
  faceClassName,
  ...props
}: CardProps) {
  // Animation trigger
  const { ref, shouldAnimate } = useAnimationTrigger<HTMLDivElement>(animate);

  // Wrapper classes
  const wrapperClassName = twMerge(
    [
      // Layout and stacking
      "relative isolate h-full w-full",

      // Shadow
      "shadow-[var(--shadow)]",
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
    <div ref={ref} className={wrapperClassName} data-pop-direction={popDirection}>
      <article
        className={twMerge(
          [
            cardStyles({ variant, size }),

            // Resting stroke, or none while the SVG draws it.
            shouldAnimate ? "border-none" : "border-border",

            // Pop target. Must be the wrapper's direct child.
            shouldAnimate && "brutal-pop-face",
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
            radius={rounded ? "var(--radius)" : undefined}
            className="z-30"
          />
        )}
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
