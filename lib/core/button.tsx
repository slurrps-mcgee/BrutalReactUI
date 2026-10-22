import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import DrawBorder from "../utils/draw-border";
import {
  borderPaintClass,
  faceRadiusClass,
  useSurfaceAnimate,
  useSurfaceFlag,
} from "../utils/surface";
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
    "font-mono font-bold uppercase tracking-wide",

    // Press interaction. The offset is added only while the shadow is on.
    "transition-transform duration-150",

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
      fluid: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fluid: false,
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
    shadow?: boolean;
    border?: boolean;
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
  fluid,
  animate: animateProp,
  rounded: roundedProp,
  shadow: shadowProp,
  border: borderProp,
  wrapperClassName: wrapperClassNameProp,
  faceClassName,
  fillClassName,
  type = "button",
  ...props
}: ButtonProps) {
  // Parent surface fills any prop this button leaves unset.
  const animate = useSurfaceAnimate(animateProp);
  const rounded = useSurfaceFlag(roundedProp, "rounded", false);
  const shadow = useSurfaceFlag(shadowProp, "shadow", true);
  const border = useSurfaceFlag(borderProp, "border", true);
  const { ref, shouldAnimate } = useAnimationTrigger<HTMLDivElement>(animate);
  // Wrapper classes
  const wrapperClassName = twMerge(
    [
      // Layout and stacking
      "relative isolate self-center items-center",

      // Full width
      fluid ? "flex w-full" : "inline-flex w-fit",

      // Hard offset. A flat face stays put.
      shadow && "shadow-[var(--shadow)]",
      rounded && "rounded-[var(--radius)]",

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
      data-surface-shadow={
        shadowProp === undefined ? undefined : shadow ? "own" : "off"
      }
      data-rounded={roundedProp === false ? "false" : undefined}
    >
      <button
        type={type}
        className={twMerge(
          [
            buttonStyles({ variant, size, fluid }),

            // Drawn stroke, or the resting border. border false drops both.
            shouldAnimate && border ? "border-none" : borderPaintClass(border),

            // Press into the shadow. A flat button stays put.
            shadow &&
              "active:translate-x-[var(--shadow-offset-x)] active:translate-y-[var(--shadow-offset-y)]",

            // Pop target. Must be the wrapper's direct child.
            shouldAnimate && "brutal-pop-face",
            faceRadiusClass(rounded),
            faceClassName,
            className,
          ]
            .filter(Boolean)
            .join(" "),
        )}
        {...props}
      >
        {shouldAnimate && border && (
          <DrawBorder
            animate
            radius={rounded ? "var(--radius)" : undefined}
            className="z-20"
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
              // Cover the face up to the stroke. A drawn stroke is centered on the
              // edge, so only half of it sits inside the face. A resting border
              // already ends at the padding box.
              "pointer-events-none absolute z-0 overflow-hidden",
              shouldAnimate && border && rounded
                ? "inset-[max(0px,calc(var(--border-width)/2-1px))] rounded-[max(0px,calc(var(--radius)-var(--border-width)/2+1px))]"
                : "inset-0",
              rounded &&
                !(shouldAnimate && border) &&
                "rounded-[max(0px,calc(var(--radius)-var(--border-width)))]",
            ]
              .filter(Boolean)
              .join(" "),
          )}
        >
          <span className={twMerge(fillStyles({ variant }), fillClassName)} />
        </span>
      </button>
    </div>
  );
}
