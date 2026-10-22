import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Check } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useSurfaceFlag } from "../utils/surface";

// Checkbox control styles
const checkboxStyles = cva(
  [
    // Layout and stacking
    "relative isolate inline-flex shrink-0 items-center justify-center",

    // Border and fill
    "border-[length:var(--border-width)] border-border bg-secondary-background text-foreground",

    // Press interaction
    "transition-[transform,box-shadow] duration-150 ease-out",

    // Keyboard focus and disabled state are driven by the native input.
    "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2",
    "peer-disabled:cursor-not-allowed peer-disabled:bg-disabled peer-disabled:text-disabled-foreground",
    "peer-disabled:shadow-none motion-reduce:transition-none",
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

// Checkbox props
export type CheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "type"
> &
  VariantProps<typeof checkboxStyles> & {
    label?: ReactNode;
    rounded?: boolean;
    shadow?: boolean;
    border?: boolean;
    wrapperClassName?: string;
    controlClassName?: string;
    faceClassName?: string;
  };

// Main Checkbox component
export default function Checkbox({
  id: idProp,
  className,
  size,
  label,
  rounded: roundedProp,
  shadow: shadowProp,
  border: borderProp,
  wrapperClassName,
  controlClassName,
  faceClassName,
  disabled,
  ...props
}: CheckboxProps) {
  const rounded = useSurfaceFlag(roundedProp, "rounded", false);
  const shadow = useSurfaceFlag(shadowProp, "shadow", true);
  const border = useSurfaceFlag(borderProp, "border", true);
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
          type="checkbox"
          className={twMerge(
            "peer absolute inset-0 z-20 m-0 opacity-0",
            className,
          )}
          disabled={disabled}
          {...props}
        />
        <span
          aria-hidden="true"
          className={twMerge(
            checkboxStyles({ size }),
            "peer-checked:[&>svg]:scale-100 peer-checked:[&>svg]:opacity-100",

            // Checked box steps onto its shadow. Flat stays put.
            shadow &&
              "peer-checked:-translate-x-0.5 peer-checked:-translate-y-0.5 peer-checked:shadow-[3px_3px_0_0_var(--shadow-color)]",
            !border && "border-none",
            rounded && "rounded-[var(--radius)]",
            controlClassName,
            faceClassName,
          )}
        >
          <Check
            className={[
              // Hidden until the box is checked
              "size-[75%] scale-0 stroke-[4] opacity-0",

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
