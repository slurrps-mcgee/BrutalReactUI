import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import DrawBorder from "../utils/draw-border";
import {
  useAnimationTrigger,
  type AnimationTrigger,
} from "../utils/use-enter-viewport";

const buttonStyles = cva(
  [
    // Layout and stacking
    "group relative z-10 isolate inline-flex items-center justify-center gap-2",

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

const fillStyles = cva(
  [
    // Fill layer positioning
    "pointer-events-none absolute -inset-[3px] z-0 origin-left",

    // Fill reveal on hover and keyboard focus
    "scale-x-0 transition-transform duration-300 ease-out",
    "group-hover:scale-x-100 group-focus-visible:scale-x-100",

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

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonStyles> & {
    animate?: AnimationTrigger;
    popDirection?: "out" | "in";
  };

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
  const { ref, shouldAnimate } = useAnimationTrigger<HTMLDivElement>(animate);
  const wrapperClasses = [
    // Wrapper layout and stacking
    "relative isolate",
    fullWidth ? "flex w-full" : "inline-flex w-fit",

    // Wrapper-owned stationary shadow
    'before:pointer-events-none before:absolute before:inset-0 before:z-0 before:content-[""]',
    "before:translate-x-[var(--shadow-offset-x)]",
    "before:translate-y-[var(--shadow-offset-y)]",
    "before:bg-[var(--shadow-color)]",

    // Optional load animation and disabled appearance
    shouldAnimate && "animate-brutal-pop",
    "has-[:disabled]:opacity-50",
  ]
    .filter(Boolean)
    .join(" ");

  const buttonClassName = [
    // Optional pop target and caller classes
    shouldAnimate && "brutal-pop-face",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={ref} className={wrapperClasses} data-pop-direction={popDirection}>
      <button
        type={type}
        className={buttonStyles({
          variant,
          size,
          fullWidth,
          className: buttonClassName,
        })}
        {...props}
      >
        <DrawBorder animate={shouldAnimate} className="z-10" />
        <span className="relative z-10">{children}</span>
        <span aria-hidden="true" className={fillStyles({ variant })} />
      </button>
    </div>
  );
}
