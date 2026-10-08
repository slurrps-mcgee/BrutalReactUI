import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Check } from "lucide-react";
import { twMerge } from "tailwind-merge";

// Checkbox control styles
const checkboxStyles = cva(
  [
    // Box and interaction
    "relative isolate inline-flex shrink-0 items-center justify-center border-[3px] border-border",
    "bg-secondary-background text-foreground",
    "transition-[transform,box-shadow] duration-150 ease-out",
    "peer-checked:-translate-x-0.5 peer-checked:-translate-y-0.5",
    "peer-checked:shadow-[3px_3px_0_0_var(--shadow-color)]",

    // Focus and disabled state are driven by the native input.
    "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2",
    "peer-disabled:cursor-not-allowed peer-disabled:bg-disabled peer-disabled:text-disabled-foreground",
    "peer-disabled:shadow-none motion-reduce:transition-none",
  ].join(" "),
  {
    variants: {
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
    wrapperClassName?: string;
    controlClassName?: string;
  };

// Main Checkbox component
export default function Checkbox({
  id: idProp,
  className,
  size,
  label,
  rounded = false,
  wrapperClassName,
  controlClassName,
  disabled,
  ...props
}: CheckboxProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;

  return (
    <label
      htmlFor={id}
      className={twMerge(
        "inline-flex w-fit items-center gap-3 font-mono text-sm font-bold",
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
            rounded && "rounded-[var(--radius)]",
            controlClassName,
          )}
        >
          <Check
            className={[
              "size-[75%] scale-0 stroke-[4] opacity-0",
              "transition-[transform,opacity] duration-150 ease-out",
              "motion-reduce:transition-none",
            ].join(" ")}
          />
        </span>
      </span>
      {label != null && <span>{label}</span>}
    </label>
  );
}
