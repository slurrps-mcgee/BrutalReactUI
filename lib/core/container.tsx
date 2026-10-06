import type { HTMLAttributes, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import DrawBorder from "../utils/draw-border";
import {
  useAnimationTrigger,
  type AnimationTrigger,
} from "../utils/use-enter-viewport";

const containerStyles = cva(
  [
    "group relative z-10 isolate flex",
    "border-[3px] border-border bg-paper text-txt",
    "motion-reduce:transition-none",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "bg-main text-main-txt group-hover:text-txt group-focus-visible:text-txt",
        secondary:
          "bg-mint text-txt group-hover:text-main-txt group-focus-visible:text-main-txt",
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

export type ContainerProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof containerStyles> & {
    title: string;
    animate?: AnimationTrigger;
    popDirection?: "out" | "in";
    children?: ReactNode;
  };

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
  popDirection = "out",
  ...props
}: ContainerProps) {
  const { ref, shouldAnimate } = useAnimationTrigger<HTMLDivElement>(animate);

  const wrapperClasses = [
    "relative isolate",
    fullWidth ? "flex w-full" : "inline-flex w-fit",
    'before:pointer-events-none before:absolute before:inset-0 before:z-0 before:content-[""]',
    "before:translate-x-[var(--shadow-offset-x)]",
    "before:translate-y-[var(--shadow-offset-y)]",
    "before:bg-[var(--shadow-color)]",
    shouldAnimate && "animate-brutal-pop",
  ]
    .filter(Boolean)
    .join(" ");

  const faceClassName = [shouldAnimate && "brutal-pop-face", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={ref} className={wrapperClasses} data-pop-direction={popDirection}>
      <section
        className={containerStyles({
          variant,
          size,
          direction,
          align,
          justify,
          gap,
          fullWidth,
          className: faceClassName,
        })}
        {...props}
      >
        <DrawBorder animate={shouldAnimate} className="z-10" />
        <h2 className="relative z-10 font-display text-2xl font-bold">
          {title}
        </h2>
        {children}
      </section>
    </div>
  );
}
