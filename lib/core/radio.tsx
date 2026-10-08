import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

// Radio control styles
const radioStyles = cva(
  [
    // Circle and interaction
    "relative isolate inline-flex shrink-0 items-center justify-center rounded-full border-[3px] border-border",
    "bg-secondary-background text-foreground",
    "transition-[transform,box-shadow] duration-150 ease-out",
    "peer-checked:-translate-x-px peer-checked:-translate-y-px",
    "peer-checked:shadow-[3px_3px_0_0_var(--shadow-color)]",

    // Focus and disabled state are driven by the native input.
    "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2",
    "peer-disabled:cursor-not-allowed peer-disabled:bg-disabled peer-disabled:text-disabled-foreground",
    "peer-disabled:shadow-none motion-reduce:transition-none",
    "peer-checked:[&>span]:scale-100 peer-checked:[&>span]:opacity-100",
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

// Radio props
export type RadioProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "type"
> &
  VariantProps<typeof radioStyles> & {
    label?: ReactNode;
    wrapperClassName?: string;
    controlClassName?: string;
  };

// Main Radio component
export default function Radio({
  id: idProp,
  className,
  size,
  label,
  wrapperClassName,
  controlClassName,
  disabled,
  ...props
}: RadioProps) {
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
          type="radio"
          className={twMerge(
            "peer absolute inset-0 z-20 m-0 opacity-0",
            className,
          )}
          disabled={disabled}
          {...props}
        />
        <span className={twMerge(radioStyles({ size }), controlClassName)}>
          <span
            aria-hidden="true"
            className={[
              "size-1/2 scale-0 rounded-full bg-main opacity-0",
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
