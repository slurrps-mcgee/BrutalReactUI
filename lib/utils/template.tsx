import type { HTMLAttributes, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import {
  SurfaceProvider,
  borderPaintClass,
  faceRadiusClass,
  useSurfaceAnimate,
  useSurfaceDisabled,
  useSurfaceFlag,
  type SurfaceProps,
} from "./surface";
import DrawBorder from "./draw-border";
import { useAnimationTrigger } from "./use-enter-viewport";

const componentStyles = cva(
  [
    // Layout and stacking
    "relative z-10 isolate flex",

    // Border and typography
    "border-border font-mono font-bold uppercase tracking-wide",

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

// Component props
export type ComponentProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof componentStyles> &
  SurfaceProps & {
    children?: ReactNode;
    wrapperClassName?: string;
    faceClassName?: string;
    fillClassName?: string;
  };

/**
 * Reference shape for core components. Do not import this into the app.
 * File order. Skip a section that would be empty.
 * 1. Style consts
 * 2. Functions (hooks and helpers, not the components)
 * 3. Props for the root
 * 4. Default function for the root
 * 5. Children props
 * 6. Children functions
 * A compound alias such as Accordion.Item follows the children.
 * className and faceClassName merge onto the face, className last.
 * wrapperClassName merges onto the shadow wrapper. Skip the wrapper when the component has no shadow.
 * faceClassName is only for a bordered face. fillClassName is only for a hover fill.
 * Parents pass rounded and disabled through SurfaceProvider.
 * A parent may also pass shadow, border, and animate. Sidebar and Navbar do.
 * A child prop replaces the parent. An omitted rounded or disabled keeps the parent value.
 * An omitted shadow, border, or animate keeps a parent value when one was passed, and otherwise uses the child default.
 * border defaults to true. shadow defaults to true. animate defaults to false. rounded defaults to false.
 * shadow draws the hard offset. shadow false leaves the face in place, including while it pops.
 * Badge has no shadow. Its animate prop pops the face.
 * rounded, border, and shadow belong on every component except links. Links keep disabled.
 * animate belongs only on a component that plays the pop. A parent may pass it to children that play it.
 * disabled belongs on every component. It mutes the face and sets the native disabled state on a control.
 * variant and size belong on a component that already paints them. size is sm, md, or lg, and md keeps the current look.
 * DrawBorder mounts only while the entrance runs. The face uses border-none then, and its CSS border otherwise.
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
  animate: animateProp,
  rounded: roundedProp,
  shadow: shadowProp,
  border: borderProp,
  disabled: disabledProp,
  wrapperClassName: wrapperClassNameProp,
  faceClassName,
  fillClassName,
  ...props
}: ComponentProps) {
  const animate = useSurfaceAnimate(animateProp);
  const rounded = useSurfaceFlag(roundedProp, "rounded", false);
  const shadow = useSurfaceFlag(shadowProp, "shadow", true);
  const border = useSurfaceFlag(borderProp, "border", true);
  const disabled = useSurfaceDisabled(disabledProp);
  const { ref, shouldAnimate } = useAnimationTrigger<HTMLDivElement>(animate);
  const wrapperClassName = twMerge(
    [
      // Layout and stacking
      "relative isolate",

      // Full width
      fluid ? "flex w-full" : "inline-flex w-fit",

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

            // Drawn stroke, or the resting border. border false drops both.
            shouldAnimate && border ? "border-none" : borderPaintClass(border),

            // Pop target. Must be the wrapper's direct child.
            shouldAnimate && "brutal-pop-face",
            faceRadiusClass(rounded),

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
        {shouldAnimate && border && (
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
        <SurfaceProvider rounded={roundedProp} disabled={disabledProp}>
          <span className="relative z-10">{children}</span>
        </SurfaceProvider>
      </div>
    </div>
  );
}
