import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import DrawBorder from "../utils/draw-border";
import {
  useAnimationTrigger,
  type AnimationTrigger,
} from "../utils/use-enter-viewport";

const badgeStyles = cva(
  [
    // Layout and stacking
    "group relative z-10 isolate inline-flex w-fit self-start items-center justify-center",

    // Border and typography. Color matches the drawn stroke.
    "border-[3px] border-border text-center font-mono text-xs font-bold uppercase border-none",

    // Disabled state and reduced motion
    "motion-reduce:transition-none",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: "bg-sky text-main-txt",
        secondary: "bg-rose text-main-txt",
        outline: "bg-muted text-txt",
      },
      size: {
        sm: "px-2 py-1",
        md: "px-3 py-1.5",
        lg: "px-4 py-2 text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "sm",
    },
  },
);

export type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeStyles> & {
    animate?: AnimationTrigger;
    popDirection?: "out" | "in";
  };

export default function Badge({
  children,
  className,
  variant,
  size,
  animate = false,
  popDirection = "out",
  ...props
}: BadgeProps) {
  const { ref, shouldAnimate } = useAnimationTrigger<HTMLSpanElement>(animate);
  const faceClassName = [shouldAnimate && "brutal-pop-face", className]
    .filter(Boolean)
    .join(" ");

  const face = (
    <span
      className={badgeStyles({ variant, size, className: faceClassName })}
      {...props}
    >
      <DrawBorder animate={shouldAnimate} className="z-10" />
      <span className="relative z-10">{children}</span>
    </span>
  );

  if (!animate) {
    return face;
  }

  const wrapperClasses = [
    "relative isolate inline-flex w-fit self-start",
    'before:pointer-events-none before:absolute before:inset-0 before:z-0 before:content-[""]',
  ].join(" ");

  return (
    <span
      ref={ref}
      className={wrapperClasses}
      data-pop-direction={popDirection}
    >
      {face}
    </span>
  );
}
