import type { InputHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { useFormFieldControl } from "./form";

// Input styles
const inputStyles = cva(
  [
    // Layout and stacking
    "relative z-10 w-full border-[3px] border-border font-mono",

    // The field sits on the shadow plate, then lifts off on focus.
    "transition-transform duration-150",
    "translate-x-[var(--shadow-offset-x)]",
    "translate-y-[var(--shadow-offset-y)]",
    "focus:translate-x-0",
    "focus:translate-y-0",
    "focus:z-20 focus-visible:outline-none",

    // Disabled state
    "disabled:cursor-not-allowed disabled:bg-disabled disabled:text-disabled-foreground",

    // Reduced motion
    "motion-reduce:transition-none",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          // Fill, ink, and hint
          "bg-secondary-background text-foreground placeholder:text-foreground/60",

          // Surface for outline children. Hover slide stays main.
          "[--surface:var(--secondary-background)] [--surface-foreground:var(--foreground)] [--outline-button-fill:var(--main)]",
        ].join(" "),
        secondary: [
          // Fill, ink, and hint
          "bg-secondary-background text-foreground placeholder:text-foreground/60",

          // Surface for outline children. Hover slide stays main.
          "[--surface:var(--secondary-background)] [--surface-foreground:var(--foreground)] [--outline-button-fill:var(--main)]",
        ].join(" "),
        outline: [
          // Cut out of the parent. The hint follows that same ink.
          "bg-[var(--surface)] text-[var(--surface-foreground)] placeholder:text-current/60",
        ].join(" "),
      },
      // Padding and type size
      size: {
        sm: "px-3 py-2 text-xs",
        md: "px-4 py-3 text-sm",
        lg: "px-5 py-4 text-base",
      },
      validity: {
        valid: "border-success",
        invalid: "border-danger",
        neutral: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      validity: "neutral",
    },
  },
);

// Input props
export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> &
  VariantProps<typeof inputStyles> & {
    wrapperClassName?: string;
    faceClassName?: string;
    rounded?: boolean;
    valid?: boolean;
    invalid?: boolean;
  };

// Main Input component
export default function Input({
  className,
  wrapperClassName: wrapperClassNameProp,
  faceClassName,
  variant,
  size,
  rounded = false,
  valid: validProp,
  invalid: invalidProp,
  id: idProp,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...inputProps
}: InputProps) {
  const field = useFormFieldControl();
  const valid = validProp ?? field?.valid ?? false;
  const invalid = invalidProp ?? field?.invalid ?? false;
  const isInvalid = invalid || ariaInvalid === true || ariaInvalid === "true";
  const validity = isInvalid ? "invalid" : valid ? "valid" : "neutral";

  // Wrapper classes
  const wrapperClassName = twMerge(
    "flex w-full items-center",
    isInvalid && "[--shadow-color:var(--danger)]",
    !isInvalid && valid && "[--shadow-color:var(--success)]",
    wrapperClassNameProp,
  );

  // Main return
  return (
    <div className={wrapperClassName}>
      <div className="relative isolate w-full">
        <div
          aria-hidden="true"
          className={twMerge(
            [
              // Offset plate. The field covers it at rest and lifts off on focus.
              "pointer-events-none absolute inset-0 z-0 bg-[var(--shadow-color)]",
              "translate-x-[var(--shadow-offset-x)] translate-y-[var(--shadow-offset-y)]",
              rounded && "rounded-[var(--radius)]",
            ]
              .filter(Boolean)
              .join(" "),
          )}
        />
        <input
          id={idProp ?? field?.controlId}
          className={twMerge(
            inputStyles({ variant, size, validity }),
            rounded && "rounded-[var(--radius)]",
            faceClassName,
            className,
          )}
          aria-describedby={
            ariaDescribedBy ?? (isInvalid ? field?.feedbackId : undefined)
          }
          aria-invalid={isInvalid || undefined}
          {...inputProps}
        />
      </div>
    </div>
  );
}
