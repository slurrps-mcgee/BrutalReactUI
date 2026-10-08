import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import DrawBorder from "../utils/draw-border";
import {
  useAnimationTrigger,
  type AnimationTrigger,
} from "../utils/use-enter-viewport";

// Button styles
const buttonStyles = cva(
  [
    // Layout and stacking
    "group/button relative z-10 isolate inline-flex items-center justify-center self-center gap-2",

    // Border width. Color is chosen once we know if the stroke is drawn.
    "border-[3px] font-mono font-bold uppercase tracking-wide",

    // Press interaction
    "transition-transform duration-150",
    "active:translate-x-[var(--shadow-offset-x)]",
    "active:translate-y-[var(--shadow-offset-y)]",

    // Keyboard focus
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-ring focus-visible:ring-offset-2",

    // Selected text. className can override these utilities.
    "selection:bg-main selection:text-main-foreground",

    // Disabled state and reduced motion. Gray communicates that it cannot be used.
    "disabled:pointer-events-none disabled:bg-disabled disabled:text-disabled-foreground",
    "motion-reduce:transition-none",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          // Fill and ink. Hover text flips when the slide covers the face.
          "bg-main text-main-foreground",
          "group-hover/button:text-foreground group-focus-visible/button:text-foreground",

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
          // Cut out of the parent surface and ink. Hover ink lives on the label.
          "bg-[var(--surface)] text-[var(--surface-foreground)]",
        ].join(" "),
      },
      // Padding and type size
      size: {
        sm: "px-3 py-2 text-xs",
        md: "px-5 py-3 text-sm",
        lg: "px-7 py-4 text-base",
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
      fullWidth: false,
    },
  },
);

// Hover and focus fill styles
const fillStyles = cva(
  [
    // Fill layer positioning. Slightly larger than the clip so subpixels still meet the stroke.
    "pointer-events-none absolute -inset-px origin-left",

    // Fill reveal on hover and keyboard focus
    "scale-x-0 transition-transform duration-300 ease-out",
    "group-hover/button:scale-x-100 group-focus-visible/button:scale-x-100",

    // Reduced motion
    "motion-reduce:transition-none",
  ].join(" "),
  {
    variants: {
      // Slide color. Outline reads the parent so a main parent uses secondary.
      variant: {
        primary: "bg-chart-2",
        secondary: "bg-main",
        outline: "bg-[var(--outline-button-fill)]",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

// Button props
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonStyles> & {
    animate?: AnimationTrigger;
    rounded?: boolean;
    wrapperClassName?: string;
    faceClassName?: string;
    fillClassName?: string;
  };

// Main Button component
export default function Button({
  children,
  className,
  variant,
  size,
  fullWidth,
  animate = false,
  rounded = false,
  wrapperClassName: wrapperClassNameProp,
  faceClassName,
  fillClassName,
  type = "button",
  ...props
}: ButtonProps) {
  // Animation trigger
  const { ref, shouldAnimate } = useAnimationTrigger<HTMLDivElement>(animate);

  // Wrapper classes
  const wrapperClassName = twMerge(
    [
      // Layout and stacking
      "relative isolate self-center items-center",

      // Full width
      fullWidth ? "flex w-full" : "inline-flex w-fit",

      // Shadow
      "shadow-[var(--shadow)]",
      rounded &&
        "rounded-[var(--radius)]",

      // Animation
      shouldAnimate && "animate-brutal-pop",

      // Disabled state stays at full strength so the label remains readable.
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
            buttonStyles({ variant, size, fullWidth }),

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
        {/* Children. Outline ink turns dark on the slide, which is a descendant of the group. */}
        <span
          className={twMerge(
            "relative z-10",
            variant === "outline" &&
              "group-hover/button:text-main-foreground group-focus-visible/button:text-main-foreground",
          )}
        >
          {children}
        </span>
        {/* Fill */}
        <span
          aria-hidden="true"
          className={twMerge(
            [
              // Clip the slide to the stroke so it does not paint past the border.
              "pointer-events-none absolute -inset-[1px] z-0 overflow-hidden",
              rounded && "rounded-[calc(var(--radius)+1px)]",
            ]
              .filter(Boolean)
              .join(" "),
          )}
        >
          <span
            className={twMerge(
              fillStyles({ variant }),
              rounded && "rounded-[calc(var(--radius)+2px)]",
              fillClassName,
            )}
          />
        </span>
      </button>
    </div>
  );
}
