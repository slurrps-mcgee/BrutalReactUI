import type { HTMLAttributes, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import DrawBorder from "./draw-border";
import {
  useAnimationTrigger,
  type AnimationTrigger,
} from "./use-enter-viewport";

const componentStyles = cva(
  [
    // Layout and stacking
    "relative z-10 isolate flex",

    // Border and typography
    "border-[3px] border-border font-mono font-bold uppercase tracking-wide",

    // Reduced motion
    "motion-reduce:transition-none",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          // Fill and ink
          "bg-main text-main-foreground",

          // Surface for outline children. A main parent slides the outline button in secondary.
          "[--surface:var(--main)] [--surface-foreground:var(--main-foreground)] [--outline-button-fill:var(--chart-2)]",
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
        sm: "px-3 py-2 text-xs",
        md: "px-5 py-3 text-sm",
        lg: "px-7 py-4 text-base",
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
      direction: "row",
      align: "center",
      justify: "center",
      gap: "none",
      fullWidth: false,
    },
  },
);

type ComponentProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof componentStyles> & {
    children?: ReactNode;
    animate?: AnimationTrigger;
    rounded?: boolean;
    wrapperClassName?: string;
    faceClassName?: string;
  };

/**
 * Reference shape for core components. Do not import this into the app.
 * Order: styles, props, component, shouldAnimate, wrapperClassName.
 * className and faceClassName merge onto the face, className last.
 * wrapperClassName merges onto the shadow wrapper.
 * DrawBorder mounts only when shouldAnimate is true. Otherwise the face uses border-border.
 * Badge has no shadow. Its animate prop only draws the border.
 * The pop face must be the wrapper's direct child: .animate-brutal-pop > .brutal-pop-face.
 * Layout props (direction, align, justify, gap, fullWidth) belong on layout components such as Container.
 */
export default function Component({
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
  rounded = false,
  wrapperClassName: wrapperClassNameProp,
  faceClassName,
  ...props
}: ComponentProps) {
  const { ref, shouldAnimate } = useAnimationTrigger<HTMLDivElement>(animate);
  const wrapperClassName = twMerge(
    [
      // Layout and stacking
      "relative isolate",

      // Full width
      fullWidth ? "flex w-full" : "inline-flex w-fit",

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

  return (
    <div
      ref={ref}
      className={wrapperClassName}
      data-pop-direction="out"
    >
      <div
        className={twMerge(
          [
            componentStyles({
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
        {shouldAnimate && (
          <DrawBorder
            animate
            radius={rounded ? "var(--radius)" : undefined}
            className="z-10"
          />
        )}
        <span className="relative z-10">{children}</span>
      </div>
    </div>
  );
}
