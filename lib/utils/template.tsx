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
    // Layout and stacking
    "relative z-10 isolate flex",

    // Border and typography
    "border-[3px] border-border font-mono font-bold uppercase tracking-wide",

    // Reduced motion
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
      // Padding and type size
      size: {
        sm: "px-3 py-2 text-xs",
        md: "px-5 py-3 text-sm",
        lg: "px-7 py-4 text-base",
      },
      // Flex direction
      direction: {
        row: "flex-row",
        column: "flex-col",
      },
      // Cross-axis alignment
      align: {
        start: "items-start",
        center: "items-center",
        end: "items-end",
        stretch: "items-stretch",
      },
      // Main-axis alignment
      justify: {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
        between: "justify-between",
      },
      // Space between children
      gap: {
        none: "gap-0",
        sm: "gap-3",
        md: "gap-5",
        lg: "gap-8",
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
      direction: "row",
      align: "center",
      justify: "center",
      gap: "none",
      fluid: false,
    },
  },
);

type ComponentProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof componentStyles> & {
    children?: ReactNode;
    animate?: AnimationTrigger;
    rounded?: boolean;
    shadow?: boolean;
    disabled?: boolean;
    wrapperClassName?: string;
    faceClassName?: string;
    fillClassName?: string;
  };

/**
 * Reference shape for core components. Do not import this into the app.
 * Order: styles, props, component, shouldAnimate, wrapperClassName.
 * className and faceClassName merge onto the face, className last.
 * wrapperClassName merges onto the shadow wrapper. Skip the wrapper when the component has no shadow.
 * faceClassName is only for a bordered face. fillClassName is only for a hover fill.
 * shadow draws the hard offset. A truthy animate forces it on, because the pop moves by that offset.
 * Badge has no shadow. Its animate prop only draws the border.
 * rounded and disabled belong on every component. disabled mutes the face and sets the native disabled state on a control.
 * variant and size belong on a component that already paints them. size is sm, md, or lg, and md keeps the current look.
 * DrawBorder mounts only when shouldAnimate is true. Otherwise the face uses border-border.
 * The pop face must be the wrapper's direct child: .animate-brutal-pop > .brutal-pop-face.
 * Layout props (direction, align, justify, gap, fluid) belong on layout components. Container width is fluid or max-w-7xl.
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
  fluid,
  animate = false,
  rounded = false,
  shadow = true,
  disabled = false,
  wrapperClassName: wrapperClassNameProp,
  faceClassName,
  fillClassName,
  ...props
}: ComponentProps) {
  const { ref, shouldAnimate } = useAnimationTrigger<HTMLDivElement>(animate);
  const showShadow = shadow || Boolean(animate);
  const wrapperClassName = twMerge(
    [
      // Layout and stacking
      "relative isolate",

      // Full width
      fluid ? "flex w-full" : "inline-flex w-fit",

      // Shadow. Animation needs the offset, so a pop turns it on.
      showShadow && "shadow-[var(--shadow)]",
      rounded && "rounded-[var(--radius)]",

      // Animation
      shouldAnimate && "animate-brutal-pop",
    ]
      .filter(Boolean)
      .join(" "),
    wrapperClassNameProp,
  );

  return (
    <div ref={ref} className={wrapperClassName} data-pop-direction="out">
      <div
        className={twMerge(
          [
            componentStyles({
              variant,
              size,
              direction,
              align,
              justify,
              gap,
              fluid,
            }),

            // Resting stroke, or none while the SVG draws it.
            shouldAnimate ? "border-transparent" : "border-border",

            // Pop target. Must be the wrapper's direct child.
            shouldAnimate && "brutal-pop-face",
            rounded && "rounded-[var(--radius)]",

            // Disabled state
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
        {shouldAnimate && (
          <DrawBorder
            animate
            radius={rounded ? "var(--radius)" : undefined}
            className="z-10"
          />
        )}
        <span
          aria-hidden="true"
          className={twMerge(
            "pointer-events-none absolute inset-0",
            fillClassName,
          )}
        />
        <span className="relative z-10">{children}</span>
      </div>
    </div>
  );
}
