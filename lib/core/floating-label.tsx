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
};

// Main FloatingLabel component
export default function FloatingLabel({
  label,
  htmlFor,
  children,
  className,
  labelClassName,
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
    className: twMerge("pt-6 pb-2", child.props.className),
  });

  return (
    <div
      className={twMerge(
        [
          "group/floating relative w-full",
          "[&:has(input:not(:placeholder-shown))>label]:top-2",
          "[&:has(input:not(:placeholder-shown))>label]:translate-y-0",
          "[&:has(input:not(:placeholder-shown))>label]:text-[0.65rem]",
          "[&:focus-within>label]:top-2 [&:focus-within>label]:translate-y-0",
          "[&:focus-within>label]:text-[0.65rem]",
        ].join(" "),
        className,
      )}
      {...props}
    >
      {control}
      <label
        htmlFor={id}
        className={twMerge(
          [
            "pointer-events-none absolute left-4 top-1/2 z-20 -translate-y-1/2",
            "font-mono text-sm font-bold uppercase tracking-wide",
            "transition-[top,transform,font-size] duration-150",
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
