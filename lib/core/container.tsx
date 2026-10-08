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
    "border-[3px] bg-secondary-background text-foreground",

    // Disabled state and reduced motion
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
      // Stretch the face with the wrapper
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
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
    rounded?: boolean;
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
  fullWidth,
  animate = false,
  shadow = false,
  rounded = false,
  wrapperClassName: wrapperClassNameProp,
  faceClassName,
  ...props
}: ContainerProps) {
  const { ref, shouldAnimate } = useAnimationTrigger<HTMLDivElement>(animate);

  // Wrapper classes
  const wrapperClassName = twMerge(
    [
      // Layout and stacking
      "relative isolate",

      // Full width
      fullWidth ? "flex w-full" : "inline-flex w-fit",

      // Shadow
      shadow && "shadow-[var(--shadow)]",
      rounded && "rounded-[var(--radius)]",
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
              fullWidth,
            }),

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
            className="z-10"
          />
        )}
        {/* Section title sits above the drawn stroke. */}
        <h2 className="relative z-10 font-display text-2xl font-bold">
          {title}
        </h2>
        {children}
      </section>
    </div>
  );
}
