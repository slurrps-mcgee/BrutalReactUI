import { type HTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { SurfaceProvider, useSurfaceFlag } from "../utils/surface";

// InputGroup styles
const inputGroupStyles = cva(
  [
    // Children share one visual row or column.
    "relative z-10 flex w-full items-stretch transition-transform duration-150 [&>*]:min-w-0",
    "motion-reduce:transition-none",

    // Nested control wrappers join one shared plate instead of keeping their
    // individual offsets and shadows.
    "[&>div]:shrink-0 [&>div]:self-stretch",
    "[&>div:has(input)]:min-w-0 [&>div:has(input)]:flex-1",
    "[&>div>button]:h-full [&>div>div]:h-full",
    "[&_input]:h-full [&_input]:translate-x-0 [&_input]:translate-y-0",
  ].join(" "),
  {
    variants: {
      // Direction. Neighbors share one 3px stroke.
      orientation: {
        horizontal: "flex-row [&>*+*]:-ml-[var(--border-width)]",
        vertical: "flex-col [&>*+*]:-mt-[var(--border-width)] [&>div]:w-full",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  },
);

// InputGroup props
export type InputGroupProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof inputGroupStyles> & {
    label?: string;
    rounded?: boolean;
    shadow?: boolean;
    border?: boolean;
    wrapperClassName?: string;
    faceClassName?: string;
    children?: ReactNode;
  };

// Main InputGroup component
export function InputGroup({
  className,
  orientation,
  label,
  rounded: roundedProp,
  shadow: shadowProp,
  border: borderProp,
  wrapperClassName,
  faceClassName,
  children,
  ...props
}: InputGroupProps) {
  const rounded = useSurfaceFlag(roundedProp, "rounded", false);
  const shadow = useSurfaceFlag(shadowProp, "shadow", true);
  // border stays on this component. It is not passed down yet.
  void borderProp;

  return (
    <div
      className={twMerge(
        "group/input-group relative isolate w-full",
        rounded && "rounded-[var(--radius)]",
        wrapperClassName,
      )}
    >
      {shadow && (
        <div
          aria-hidden="true"
          className={twMerge(
            "pointer-events-none absolute inset-0 bg-[var(--shadow-color)]",
            "translate-x-[var(--shadow-offset-x)] translate-y-[var(--shadow-offset-y)]",
            rounded && "rounded-[var(--radius)]",
          )}
        />
      )}
      <div
        role="group"
        aria-label={label}
        className={twMerge(
          inputGroupStyles({ orientation }),

          // Sit on the plate, then lift off on focus. A flat group stays put.
          shadow &&
            "translate-x-[var(--shadow-offset-x)] translate-y-[var(--shadow-offset-y)] group-focus-within/input-group:translate-x-0 group-focus-within/input-group:translate-y-0",
          // One shared plate. A child that sets shadow keeps its own offset.
          shadow &&
            "[&>div:not([data-surface-shadow=own])]:!shadow-none [&>div:not([data-surface-shadow=own])>div>[aria-hidden=true]]:hidden",
          rounded && "overflow-hidden rounded-[var(--radius)]",
          rounded &&
            "[&>*:first-child:has([data-rounded=false])]:!rounded-none [&>*:first-child:has([data-rounded=false])_*]:!rounded-none [&>*:last-child:has([data-rounded=false])]:!rounded-none [&>*:last-child:has([data-rounded=false])_*]:!rounded-none",
          rounded &&
            (orientation === "vertical"
              ? [
                  "[&>*:first-child]:rounded-t-[var(--radius)]",
                  "[&>*:last-child]:rounded-b-[var(--radius)]",
                  "[&>*:first-child_button]:rounded-t-[var(--radius)]",
                  "[&>*:last-child_button]:rounded-b-[var(--radius)]",
                  "[&>*:first-child_input]:rounded-t-[var(--radius)]",
                  "[&>*:last-child_input]:rounded-b-[var(--radius)]",
                ].join(" ")
              : [
                  "[&>*:first-child]:rounded-l-[var(--radius)]",
                  "[&>*:last-child]:rounded-r-[var(--radius)]",
                  "[&>*:first-child_button]:rounded-l-[var(--radius)]",
                  "[&>*:last-child_button]:rounded-r-[var(--radius)]",
                  "[&>*:first-child_input]:rounded-l-[var(--radius)]",
                  "[&>*:last-child_input]:rounded-r-[var(--radius)]",
                ].join(" ")),
          faceClassName,
          className,
        )}
        {...props}
      >
        <SurfaceProvider
          // The group paints the outer corners. A full radius on every child would split the row.
          rounded={false}
        >
          {children}
        </SurfaceProvider>
      </div>
    </div>
  );
}

// InputGroupText props
export type InputGroupTextProps = HTMLAttributes<HTMLSpanElement> & {
  border?: boolean;
  rounded?: boolean;
};

// Static prefix or suffix
export function InputGroupText({
  className,
  border: borderProp,
  rounded: roundedProp,
  ...props
}: InputGroupTextProps) {
  const border = useSurfaceFlag(borderProp, "border", true);

  return (
    <span
      data-rounded={roundedProp === false ? "false" : undefined}
      className={twMerge(
        "inline-flex shrink-0 items-center justify-center border-[length:var(--border-width)] border-border bg-main px-4 font-mono text-sm font-bold text-main-foreground",
        !border && "border-none",
        roundedProp && "rounded-[var(--radius)]",
        className,
      )}
      {...props}
    />
  );
}

export default InputGroup;
