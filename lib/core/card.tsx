import { useLayoutEffect, useRef, type HTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import DrawBorder from "../utils/draw-border";
import {
  borderPaintClass,
  faceRadiusClass,
} from "../utils/surface";
import {
  useAnimationTrigger,
  type AnimationTrigger,
} from "../utils/use-enter-viewport";

// Card styles
const cardStyles = cva(
  [
    // Layout and stacking
    "relative z-10 isolate flex h-full w-full flex-col [--card-radius:0px]",

    // Border and typography.
    "bg-secondary-background text-foreground",

    // Press interaction is added only while the shadow is on.

    // Disabled state and reduced motion
    "motion-reduce:transition-none",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          // Fill and ink
          "bg-main text-main-foreground",

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
      // Padding, gap, and type size. --card-padding lets CardImage bleed to the stroke.
      size: {
        sm: "gap-3 p-4 text-sm [--card-padding:1rem]",
        md: "gap-4 p-6 text-base [--card-padding:1.5rem]",
        lg: "gap-6 p-8 text-lg [--card-padding:2rem]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

// Card props
export type CardProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof cardStyles> & {
    animate?: AnimationTrigger;
    rounded?: boolean;
    shadow?: boolean;
    border?: boolean;
    disabled?: boolean;
    wrapperClassName?: string;
    faceClassName?: string;
    children?: ReactNode;
  };

// Main Card component
export default function Card({
  children,
  className,
  variant,
  size,
  animate = false,
  rounded = false,
  shadow = true,
  border = true,
  disabled = false,
  wrapperClassName: wrapperClassNameProp,
  faceClassName,
  ...props
}: CardProps) {
  // Animation trigger
  const { ref, shouldAnimate } = useAnimationTrigger<HTMLDivElement>(animate);
  const faceRef = useRef<HTMLElement>(null);

  // The used stroke can snap below the token. CardImage bleeds by that width.
  useLayoutEffect(() => {
    const face = faceRef.current;
    if (!face) return;

    const read = () => {
      const used = Number.parseFloat(getComputedStyle(face).borderTopWidth);
      const next = Number.isFinite(used) && used > 0 ? used : 0;
      face.style.setProperty("--card-border", `${next}px`);
    };

    read();
    const observer = new ResizeObserver(read);
    observer.observe(face);
    return () => observer.disconnect();
  }, [border, shouldAnimate]);

  // Wrapper classes
  const wrapperClassName = twMerge(
    [
      // Layout and stacking
      "relative isolate h-full w-full",

      // Hard offset. A flat face stays put.
      shadow && "shadow-[var(--shadow)]",
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
    <div ref={ref} className={wrapperClassName} data-pop-direction="out">
      <article
        ref={faceRef}
        className={twMerge(
          [
            cardStyles({ variant, size }),

            // Drawn stroke, or the resting border. border false drops both.
            // --card-border is the used width so CardImage stops at that stroke.
            shouldAnimate && border ? "border-none" : borderPaintClass(border),
            border && !shouldAnimate
              ? "[--card-border:var(--border-width)]"
              : "[--card-border:0px]",

            // Press into the shadow. A flat card stays put.
            shadow &&
              "transition-transform duration-150 hover:translate-x-[var(--shadow-offset-x)] hover:translate-y-[var(--shadow-offset-y)] motion-reduce:transition-none",

            // Pop target. Must be the wrapper's direct child.
            shouldAnimate && "brutal-pop-face",
            faceRadiusClass(rounded),
            rounded && "[--card-radius:var(--radius)]",
            disabled && "pointer-events-none opacity-70",
            faceClassName,
            className,
          ]
            .filter(Boolean)
            .join(" "),
        )}
        aria-disabled={disabled || undefined}
        {...props}
      >
        {children}
        {shouldAnimate && border && (
          <DrawBorder
            animate
            radius={rounded ? "var(--radius)" : undefined}
            className="z-30"
          />
        )}
      </article>
    </div>
  );
}

// Card Header component
export function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return <header className={className} {...props} />;
}

// Card Body component
export function CardBody({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={className} {...props} />;
}

// Card Footer component
export function CardFooter({
  className,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return <footer className={className} {...props} />;
}

// Card Image component
export function CardImage({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(
        [
          // Cancel the face padding and the stroke width so the picture
          // sits under the border. A padding-only bleed leaves the card
          // fill as a strip beside the image, and hover makes that strip crisp.
          "w-[calc(100%+2*var(--card-padding)+2*var(--card-border,0px))]",
          "-mx-[calc(var(--card-padding)+var(--card-border,0px))]",
          "first:-mt-[calc(var(--card-padding)+var(--card-border,0px))]",
          "last:-mb-[calc(var(--card-padding)+var(--card-border,0px))]",
          "overflow-hidden",
          "first:rounded-t-[var(--card-radius,0px)]",
          "last:rounded-b-[var(--card-radius,0px)]",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}
