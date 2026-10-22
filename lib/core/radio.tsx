import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { useSurfaceFlag } from "../utils/surface";

// Radio control styles
const radioStyles = cva(
  [
    // Layout. The control stays a circle.
    "relative isolate inline-flex shrink-0 items-center justify-center rounded-full",

    // Border and fill
    "border-[length:var(--border-width)] border-border bg-secondary-background text-foreground",

    // Press interaction
    "transition-[transform,box-shadow] duration-150 ease-out",

    // Keyboard focus and disabled state are driven by the native input.
    "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2",
    "peer-disabled:cursor-not-allowed peer-disabled:bg-disabled peer-disabled:text-disabled-foreground",
    "peer-disabled:shadow-none motion-reduce:transition-none",

    // Reveal the dot once the native input is checked.
    "peer-checked:[&>span]:scale-100 peer-checked:[&>span]:opacity-100",
  ].join(" "),
  {
    variants: {
      // Control diameter
      size: {
        sm: "size-5",
        md: "size-6",
        lg: "size-8",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

// Radio props
export type RadioProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "type"
> &
  VariantProps<typeof radioStyles> & {
    label?: ReactNode;
    shadow?: boolean;
    border?: boolean;
    wrapperClassName?: string;
    controlClassName?: string;
    faceClassName?: string;
    rounded?: boolean;
  };

// Main Radio component
export default function Radio({
  id: idProp,
  className,
  size,
  label,
  shadow: shadowProp,
  border: borderProp,
  wrapperClassName,
  controlClassName,
  faceClassName,
  rounded: roundedProp,
  disabled,
  ...props
}: RadioProps) {
  const shadow = useSurfaceFlag(shadowProp, "shadow", true);
  const border = useSurfaceFlag(borderProp, "border", true);
  const rounded = useSurfaceFlag(roundedProp, "rounded", false);
  const generatedId = useId();
  const id = idProp ?? generatedId;

  return (
    <label
      htmlFor={id}
      className={twMerge(
        [
          // Layout
          "inline-flex w-fit items-center gap-3",

          // Typography
          "font-mono text-sm font-bold",
        ].join(" "),
        disabled && "cursor-not-allowed opacity-70",
        wrapperClassName,
      )}
    >
      <span className="relative inline-flex">
        <input
          id={id}
          type="radio"
          className={twMerge(
            "peer absolute inset-0 z-20 m-0 opacity-0",
            className,
          )}
          disabled={disabled}
          {...props}
        />
        <span
          className={twMerge(
            radioStyles({ size }),

            // Checked circle steps onto its shadow. Flat stays put.
            shadow &&
              "peer-checked:-translate-x-px peer-checked:-translate-y-px peer-checked:shadow-[3px_3px_0_0_var(--shadow-color)]",
            !border && "border-none",
            rounded && "rounded-[var(--radius)]",
            controlClassName,
            faceClassName,
          )}
        >
          <span
            aria-hidden="true"
            className={[
              // Hidden until the radio is checked
              "size-1/2 scale-0 rounded-full bg-main opacity-0",

              // Reveal
              "transition-[transform,opacity] duration-150 ease-out",

              // Reduced motion
              "motion-reduce:transition-none",
            ].join(" ")}
          />
        </span>
      </span>
      {label != null && <span>{label}</span>}
    </label>
  );
}
