import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import DrawBorder from "../utils/draw-border";
import { useInNavbar } from "./navbar";
import {
  useAnimationTrigger,
  type AnimationTrigger,
} from "../utils/use-enter-viewport";

// Toggler styles
const togglerStyles = cva(
  [
    // Layout and stacking
    "relative z-10 isolate inline-flex items-center justify-center",

    // Border and typography
    "border-[3px] font-mono font-bold",

    // Keyboard focus
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-ring focus-visible:ring-offset-2",

    // Disabled state and reduced motion. Gray communicates that it cannot be used.
    "disabled:pointer-events-none disabled:bg-disabled disabled:text-disabled-foreground",
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
      // Padding. The bars stay the same width.
      size: {
        sm: "size-9",
        md: "size-11",
        lg: "size-14",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "md",
    },
  },
);

// Toggler props
export type TogglerAnimation =
  | "normal"
  | "spin"
  | "rotate-counterclockwise"
  | "rotate-clockwise"
  | "arrow-left"
  | "arrow-right"
  | "arrow-up"
  | "arrow-down";

export type TogglerProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof togglerStyles> & {
    expanded?: boolean;
    controls?: string;
    iconAnimation?: TogglerAnimation;
    animate?: AnimationTrigger;
    rounded?: boolean;
    wrapperClassName?: string;
    faceClassName?: string;
  };

// Main Toggler component. Three bars, no motion yet.
export default function Toggler({
  expanded = false,
  controls,
  iconAnimation = "normal",
  className,
  variant,
  size,
  animate = false,
  rounded = false,
  wrapperClassName: wrapperClassNameProp,
  faceClassName,
  type = "button",
  ...props
}: TogglerProps) {
  // Animation trigger
  const { ref, shouldAnimate } = useAnimationTrigger<HTMLDivElement>(animate);
  const inNavbar = useInNavbar();

  // Wrapper classes
  const wrapperClassName = twMerge(
    [
      // Layout and stacking. Hidden from lg up inside a navbar, where the links stay open.
      "relative isolate inline-flex w-fit",
      inNavbar && "lg:hidden",

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
    <div
      ref={ref}
      className={wrapperClassName}
      data-pop-direction="out"
    >
      <button
        type={type}
        className={twMerge(
          [
            togglerStyles({ variant, size }),

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
        aria-expanded={expanded}
        aria-controls={controls}
        data-toggler-animation={iconAnimation}
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
        {/* Hamburger. CSS reads aria-expanded and the animation variant. */}
        <span
          className="brutal-toggler-icon relative z-10 block"
          aria-hidden="true"
        >
          <span className="brutal-toggler-bar" />
          <span className="brutal-toggler-bar" />
          <span className="brutal-toggler-bar" />
        </span>
      </button>
    </div>
  );
}
