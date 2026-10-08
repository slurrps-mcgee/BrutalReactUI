import { type HTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

// InputGroup styles
const inputGroupStyles = cva(
  [
    // Children share one visual row or column.
    "relative z-10 flex w-full items-stretch transition-transform duration-150 [&>*]:min-w-0",
    "translate-x-[var(--shadow-offset-x)] translate-y-[var(--shadow-offset-y)]",
    "group-focus-within/input-group:translate-x-0 group-focus-within/input-group:translate-y-0",
    "motion-reduce:transition-none",

    // Nested control wrappers join one shared plate instead of keeping their
    // individual offsets and shadows.
    "[&>div]:shrink-0 [&>div]:self-stretch [&>div]:shadow-none",
    "[&>div:has(input)]:min-w-0 [&>div:has(input)]:flex-1",
    "[&>div>button]:h-full [&>div>div]:h-full",
    "[&>div>div>[aria-hidden=true]]:hidden",
    "[&_input]:h-full [&_input]:translate-x-0 [&_input]:translate-y-0",
  ].join(" "),
  {
    variants: {
      orientation: {
        horizontal: "flex-row [&>*+*]:-ml-[3px]",
        vertical: "flex-col [&>*+*]:-mt-[3px] [&>div]:w-full",
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
    wrapperClassName?: string;
    children?: ReactNode;
  };

// Main InputGroup component
export function InputGroup({
  className,
  orientation,
  label,
  rounded = false,
  wrapperClassName,
  children,
  ...props
}: InputGroupProps) {
  return (
    <div
      className={twMerge(
        "group/input-group relative isolate w-full",
        rounded && "rounded-[var(--radius)]",
        wrapperClassName,
      )}
    >
      <div
        aria-hidden="true"
        className={twMerge(
          "pointer-events-none absolute inset-0 bg-[var(--shadow-color)]",
          "translate-x-[var(--shadow-offset-x)] translate-y-[var(--shadow-offset-y)]",
          rounded && "rounded-[var(--radius)]",
        )}
      />
      <div
        role="group"
        aria-label={label}
        className={twMerge(
          inputGroupStyles({ orientation }),
          rounded && "overflow-hidden rounded-[var(--radius)]",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

// InputGroupText props
export type InputGroupTextProps = HTMLAttributes<HTMLSpanElement>;

// Static prefix or suffix
export function InputGroupText({ className, ...props }: InputGroupTextProps) {
  return (
    <span
      className={twMerge(
        "inline-flex shrink-0 items-center justify-center border-[3px] border-border bg-main px-4 font-mono text-sm font-bold text-main-foreground",
        className,
      )}
      {...props}
    />
  );
}

export default InputGroup;
