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

    // Border and typography. Color matches the drawn stroke.
    "border-[3px] border-none font-mono font-bold uppercase tracking-wide",

    // Press interaction
    "transition-transform duration-150",
    "active:translate-x-[var(--shadow-offset-x)]",
    "active:translate-y-[var(--shadow-offset-y)]",

    // Keyboard focus
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-ring focus-visible:ring-offset-2",

    // Selected text. className can override these utilities.
    "selection:bg-main selection:text-main-foreground",

    // Disabled state and reduced motion
    "disabled:pointer-events-none",
    "motion-reduce:transition-none",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "bg-main text-main-foreground group-hover/button:text-foreground group-focus-visible/button:text-foreground",
        secondary: "bg-chart-2 text-main-foreground",
        outline:
          "bg-secondary-background text-foreground group-hover/button:text-main-foreground group-focus-visible/button:text-main-foreground",
      },
      size: {
        sm: "px-3 py-2 text-xs",
        md: "px-5 py-3 text-sm",
        lg: "px-7 py-4 text-base",
      },
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
      variant: {
        primary: "bg-chart-2",
        secondary: "bg-main",
        outline: "bg-main",
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
    popDirection?: "out" | "in";
    rounded?: boolean;
  };

// Main Button component
export default function Button({
  children,
  className,
  variant,
  size,
  fullWidth,
  animate = false,
  popDirection = "out",
  rounded = false,
  type = "button",
  ...props
}: ButtonProps) {
  // Animation trigger
  const { ref, shouldAnimate } = useAnimationTrigger<HTMLDivElement>(animate);

  // Wrapper classes
  const wrapperClasses = [
    // Layout and stacking
    "relative isolate self-center items-center",

    // Full width
    fullWidth ? "flex w-full" : "inline-flex w-fit",

    // Shadow
    "shadow-[var(--shadow)]",
    rounded && "rounded-[var(--radius)]",

    // Animation
    shouldAnimate && "animate-brutal-pop",

    // Disabled state
    "has-[:disabled]:opacity-50",
  ]
    .filter(Boolean)
    .join(" ");

  // Main return
  return (
    <div ref={ref} className={wrapperClasses} data-pop-direction={popDirection}>
      <button
        type={type}
        className={twMerge(
          buttonStyles({ variant, size, fullWidth }),
          shouldAnimate && "brutal-pop-face",
          rounded && "rounded-[var(--radius)]",
          className,
        )}
        {...props}
      >
        {/* Border */}
        <DrawBorder
          animate={shouldAnimate}
          radius={rounded ? "var(--radius)" : undefined}
          className="z-10"
        />
        {/* Children */}
        <span className="relative z-10">{children}</span>
        {/* Fill */}
        <span
          aria-hidden="true"
          className={twMerge(
            "pointer-events-none absolute -inset-[1px] z-0 overflow-hidden",
            rounded && "rounded-[calc(var(--radius)+1px)]",
          )}
        >
          <span
            className={twMerge(
              fillStyles({ variant }),
              rounded && "rounded-[calc(var(--radius)+2px)]",
            )}
          />
        </span>
      </button>
    </div>
  );
}
