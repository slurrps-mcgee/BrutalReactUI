import type { AnchorHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { MoveRight } from "lucide-react";
import {
  useAnimationTrigger,
  type AnimationTrigger,
} from "../utils/use-enter-viewport";

// Link styles
const linkStyles = cva(
  [
    // Layout and stacking
    "group/action pointer-events-auto relative z-20 inline-grid items-center self-center whitespace-nowrap pb-1",

    // Typography
    "font-mono font-bold",

    // Focus state
    "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "",
      },
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

// Link props
export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof linkStyles> & {
    href: string;
    children: string;
    animate?: AnimationTrigger;
    popDirection?: "out" | "in";
  };

// Main Link component
export default function Link({
  href,
  children,
  className,
  variant,
  size,
  animate = false,
  popDirection = "out",
  ...props
}: LinkProps) {
  // Animation trigger
  const { ref, shouldAnimate } = useAnimationTrigger<HTMLSpanElement>(animate);

  // Wrapper classes
  const isExternal = /^https?:\/\//.test(href);
  const wrapperClasses = [
    // Layout and stacking
    "relative isolate inline-flex w-fit items-center self-center",

    // Shadow
    "shadow-[var(--shadow)]",

    // Animation
    shouldAnimate && "animate-brutal-pop",
  ]
    .filter(Boolean)
    .join(" ");

  // Main return
  const link = (
    <a
      href={href}
      className={twMerge(
        linkStyles({ variant, size }),
        shouldAnimate && "brutal-pop-face",
        className,
      )}
      {...props}
      target={isExternal ? "_blank" : props.target}
      rel={isExternal ? "noopener noreferrer" : props.rel}
    >
      {/* Children */}
      <span className="relative col-start-1 row-start-1 inline-flex items-center gap-2 text-foreground">
        {children}
        <MoveRight aria-hidden="true" className="h-5 w-5 shrink-0" />
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-current"
        />
      </span>

      <span
        aria-hidden="true"
        className="pointer-events-none relative col-start-1 row-start-1 inline-flex items-center gap-2 text-main [-webkit-text-stroke:1px_currentColor] [clip-path:inset(0_100%_0_0)] transition-[clip-path] duration-300 ease-out group-hover/action:[clip-path:inset(-1px)] motion-reduce:transition-none"
      >
        {children}
        <MoveRight className="h-5 w-5 shrink-0" />
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-current" />
      </span>
    </a>
  );

  if (!animate) {
    return link;
  }

  return (
    <span
      ref={ref}
      className={wrapperClasses}
      data-pop-direction={popDirection}
    >
      {link}
    </span>
  );
}
