import {
  useId,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { twMerge } from "tailwind-merge";

// Range props
export type RangeProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: ReactNode;
  showValue?: boolean;
  output?: ReactNode;
  wrapperClassName?: string;
  rounded?: boolean;
};

// Main Range component
export default function Range({
  id: idProp,
  className,
  label,
  showValue = false,
  output,
  wrapperClassName,
  rounded = false,
  value,
  defaultValue,
  min = 0,
  max = 100,
  disabled,
  onChange,
  ...props
}: RangeProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const [uncontrolledValue, setUncontrolledValue] = useState(
    defaultValue ?? min,
  );
  const displayedValue = output ?? value ?? uncontrolledValue;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setUncontrolledValue(event.currentTarget.value);
    onChange?.(event);
  }

  return (
    <div
      className={twMerge(
        "flex w-full flex-col gap-2 font-mono text-sm",
        disabled && "opacity-70",
        wrapperClassName,
      )}
    >
      {(label != null || showValue || output != null) && (
        <div className="flex items-center justify-between gap-4">
          {label != null && (
            <label htmlFor={id} className="font-bold uppercase tracking-wide">
              {label}
            </label>
          )}
          {(showValue || output != null) && (
            <output htmlFor={id} className="font-bold tabular-nums">
              {displayedValue}
            </output>
          )}
        </div>
      )}
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        onChange={handleChange}
        className={twMerge(
          [
            "h-3 w-full cursor-pointer appearance-none border-[3px] border-border bg-secondary-background accent-main",
            "[&::-webkit-slider-thumb]:size-6 [&::-webkit-slider-thumb]:appearance-none",
            "[&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-border [&::-webkit-slider-thumb]:bg-main",
            "[&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-none",
            "[&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-border [&::-moz-range-thumb]:bg-main",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:bg-disabled",
          ].join(" "),
          rounded &&
            "rounded-full [&::-moz-range-thumb]:rounded-full [&::-webkit-slider-thumb]:rounded-full",
          className,
        )}
        {...props}
      />
    </div>
  );
}
