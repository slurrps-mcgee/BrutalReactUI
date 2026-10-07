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
    "relative z-10 isolate flex",
    "border-[3px] border-border font-mono font-bold uppercase tracking-wide",
    "motion-reduce:transition-none",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: "bg-main text-main-foreground [--surface:var(--main)]",
        secondary: "bg-chart-2 text-main-foreground [--surface:var(--chart-2)]",
        outline: "bg-[var(--surface)] text-foreground",
      },
      size: {
        sm: "px-3 py-2 text-xs",
        md: "px-5 py-3 text-sm",
        lg: "px-7 py-4 text-base",
      },
      direction: {
        row: "flex-row",
        column: "flex-col",
      },
      align: {
        start: "items-start",
        center: "items-center",
        end: "items-end",
        stretch: "items-stretch",
      },
      justify: {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
        between: "justify-between",
      },
      gap: {
        none: "gap-0",
        sm: "gap-3",
        md: "gap-5",
        lg: "gap-8",
      },
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
    popDirection?: "out" | "in";
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
  popDirection = "out",
  rounded = false,
  wrapperClassName: wrapperClassNameProp,
  faceClassName,
  ...props
}: ComponentProps) {
  const { ref, shouldAnimate } = useAnimationTrigger<HTMLDivElement>(animate);
  const wrapperClassName = twMerge(
    [
      "relative isolate",
      fullWidth ? "flex w-full" : "inline-flex w-fit",
      "shadow-[var(--shadow)]",
      rounded && "rounded-[var(--radius)]",
      shouldAnimate && "animate-brutal-pop",
    ]
      .filter(Boolean)
      .join(" "),
    wrapperClassNameProp,
  );

  return (
    <div ref={ref} className={wrapperClassName} data-pop-direction={popDirection}>
      <div
        className={twMerge(
          componentStyles({
            variant,
            size,
            direction,
            align,
            justify,
            gap,
            fullWidth,
          }),
          shouldAnimate ? "border-none" : "border-border",
          shouldAnimate && "brutal-pop-face",
          rounded && "rounded-[var(--radius)]",
          faceClassName,
          className,
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
