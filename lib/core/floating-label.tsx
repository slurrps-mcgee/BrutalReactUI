import {
  Children,
  cloneElement,
  isValidElement,
  useId,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { twMerge } from "tailwind-merge";

type FloatingControlProps = {
  id?: string;
  className?: string;
  placeholder?: string;
  "aria-label"?: string;
};

// FloatingLabel props
export type FloatingLabelProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  label: ReactNode;
  htmlFor?: string;
  children: ReactElement<FloatingControlProps>;
  labelClassName?: string;
  rounded?: boolean;
  disabled?: boolean;
};

// Main FloatingLabel component
export default function FloatingLabel({
  label,
  htmlFor,
  children,
  className,
  labelClassName,
  rounded = false,
  disabled = false,
  ...props
}: FloatingLabelProps) {
  const generatedId = useId();
  const child = Children.only(children);

  if (!isValidElement<FloatingControlProps>(child)) {
    throw new Error("FloatingLabel requires one form control child");
  }

  const id = htmlFor ?? child.props.id ?? generatedId;
  const control = cloneElement(child, {
    id,
    placeholder: child.props.placeholder ?? " ",
    className: twMerge(
      [
        // Resting padding. The label sits in the middle of the control.
        "py-4",

        // Shrink the field once it is focused or filled so the label can rise.
        "group-focus-within/floating:pt-6 group-focus-within/floating:pb-2",
        "group-has-[input:not(:placeholder-shown)]/floating:pt-6",
        "group-has-[input:not(:placeholder-shown)]/floating:pb-2",
      ].join(" "),
      child.props.className,
    ),
  });

  return (
    <div
      aria-disabled={disabled || undefined}
      className={twMerge(
        [
          // Layout
          "group/floating relative w-full",

          // Raised label once the field has a value
          "[&:has(input:not(:placeholder-shown))>label]:top-2",
          "[&:has(input:not(:placeholder-shown))>label]:h-auto",
          "[&:has(input:not(:placeholder-shown))>label]:items-start",
          "[&:has(input:not(:placeholder-shown))>label]:text-[0.65rem]",

          // Raised label while the field is focused
          "[&:focus-within>label]:top-2 [&:focus-within>label]:h-auto",
          "[&:focus-within>label]:items-start",
          "[&:focus-within>label]:text-[0.65rem]",
        ].join(" "),
        rounded && "rounded-[var(--radius)]",
        disabled && "pointer-events-none opacity-70",
        className,
      )}
      {...props}
    >
      {control}
      <label
        htmlFor={id}
        className={twMerge(
          [
            // Layout. The label covers the control until it rises.
            "pointer-events-none absolute inset-x-4 top-0 z-20 flex h-full items-center",

            // Typography
            "font-mono text-sm font-bold uppercase tracking-wide",

            // Rise
            "transition-[top,height,font-size] duration-150",

            // Reduced motion
            "motion-reduce:transition-none",
          ].join(" "),
          labelClassName,
        )}
      >
        {label}
      </label>
    </div>
  );
}
