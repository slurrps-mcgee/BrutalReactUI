import type { HTMLAttributes, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import DrawBorder from "../utils/draw-border";
import {
  useAnimationTrigger,
  type AnimationTrigger,
} from "../utils/use-enter-viewport";

const cardStyles = cva(
  [
    // Layout and stacking
    "group relative z-10 isolate flex h-full w-full flex-col",

    // Border and typography. Color matches the drawn stroke.
    "border-[3px] border-border bg-paper text-txt border-none",

    // Press interaction
    "transition-transform duration-150",
    "hover:translate-x-[var(--shadow-offset-x)]",
    "hover:translate-y-[var(--shadow-offset-y)]",
    "motion-reduce:transition-none",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "bg-main text-main-txt group-hover:text-txt group-focus-visible:text-txt",
        secondary:
          "bg-mint text-txt group-hover:text-main-txt group-focus-visible:text-main-txt",
        outline:
          "bg-paper text-txt group-hover:text-main-txt group-focus-visible:text-main-txt",
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

export type CardProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof cardStyles> & {
    animate?: AnimationTrigger;
    popDirection?: "out" | "in";
    children?: ReactNode;
  };

export default function Card({
  children,
  className,
  variant,
  size,
  animate = false,
  popDirection = "out",
  ...props
}: CardProps) {
  const { ref, shouldAnimate } = useAnimationTrigger<HTMLDivElement>(animate);

  const wrapperClasses = [
    "relative isolate h-full w-full",
    'before:pointer-events-none before:absolute before:inset-0 before:z-0 before:content-[""]',
    "before:translate-x-[var(--shadow-offset-x)]",
    "before:translate-y-[var(--shadow-offset-y)]",
    "before:bg-[var(--shadow-color)]",
    shouldAnimate && "animate-brutal-pop",
  ]
    .filter(Boolean)
    .join(" ");

  const cardClassName = [shouldAnimate && "brutal-pop-face", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={ref} className={wrapperClasses} data-pop-direction={popDirection}>
      <article
        className={cardStyles({
          variant,
          size,
          className: cardClassName,
        })}
        {...props}
      >
        <DrawBorder animate={shouldAnimate} className="z-30" />
        {children}
      </article>
    </div>
  );
}

export function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return <header className={className} {...props} />;
}

export function CardBody({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={className} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return <footer className={className} {...props} />;
}

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
