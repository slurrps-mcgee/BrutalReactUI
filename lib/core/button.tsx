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
    "border-[3px] border-border font-mono font-bold uppercase tracking-wide border-none",

    // Press interaction
    "transition-transform duration-150",
    "active:translate-x-[var(--shadow-offset-x)]",
    "active:translate-y-[var(--shadow-offset-y)]",

    // Keyboard focus
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-ring focus-visible:ring-offset-2",

    // Disabled state and reduced motion
    "disabled:pointer-events-none",
    "motion-reduce:transition-none",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: "bg-main text-main-txt",
        secondary: "bg-mint text-main-txt",
        outline:
          "bg-paper text-main-txt dark:text-txt dark:hover:text-main-txt",
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
        primary: "bg-mint",
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
    'before:pointer-events-none before:absolute before:inset-0 before:z-0 before:content-[""]',
    "before:translate-x-[var(--shadow-offset-x)]",
    "before:translate-y-[var(--shadow-offset-y)]",
    "before:bg-[var(--shadow-color)]",

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
          className,
        )}
        {...props}
      >
        {/* Border */}
        <DrawBorder animate={shouldAnimate} className="z-10" />
        {/* Children */}
        <span className="relative z-10">{children}</span>
        {/* Fill */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-[1px] z-0 overflow-hidden"
        >
          <span className={fillStyles({ variant })} />
        </span>
      </button>
    </div>
  );
}
