import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

type ButtonGroupContextValue = {
  activeValue: string | null;
  disabled: boolean;
  isSelected: (value: string) => boolean;
  isTabStop: (value: string) => boolean;
  orientation: "horizontal" | "vertical";
  registerItem: (value: string, item: HTMLButtonElement | null) => void;
  rounded: boolean;
  select: (value: string) => void;
  selectionMode: "none" | "single" | "multiple";
  setActiveValue: (value: string) => void;
  moveFocus: (
    value: string,
    direction: "next" | "previous" | "first" | "last",
  ) => void;
};

const ButtonGroupContext = createContext<ButtonGroupContextValue | null>(null);

function useButtonGroup() {
  const context = useContext(ButtonGroupContext);
  if (!context) {
    throw new Error("ButtonGroupItem must render inside ButtonGroup");
  }
  return context;
}

// Button group props
export type ButtonGroupProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "onChange"
> & {
  orientation?: "horizontal" | "vertical";
  selectionMode?: "none" | "single" | "multiple";
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  disabled?: boolean;
  rounded?: boolean;
  children?: ReactNode;
};

// Grouped toolbar with optional single or multiple pressed state.
function ButtonGroupRoot({
  orientation = "horizontal",
  selectionMode = "none",
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  rounded = false,
  className,
  children,
  ...props
}: ButtonGroupProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState<string | string[]>(
    defaultValue ?? (selectionMode === "multiple" ? [] : ""),
  );
  const [activeValue, setActiveValue] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  const items = useRef(new Map<string, HTMLButtonElement>());
  const currentValue = value ?? uncontrolledValue;
  void revision;

  const registerItem = useCallback(
    (itemValue: string, item: HTMLButtonElement | null) => {
      if (item) {
        if (items.current.get(itemValue) === item) return;
        items.current.set(itemValue, item);
      } else {
        if (!items.current.has(itemValue)) return;
        items.current.delete(itemValue);
      }
      setRevision((current) => current + 1);
    },
    [],
  );

  function selected(valueToCheck: string) {
    return Array.isArray(currentValue)
      ? currentValue.includes(valueToCheck)
      : currentValue === valueToCheck;
  }

  function select(valueToSelect: string) {
    if (disabled || selectionMode === "none") return;

    let nextValue: string | string[];
    if (selectionMode === "multiple") {
      const current = new Set(Array.isArray(currentValue) ? currentValue : []);
      if (current.has(valueToSelect)) current.delete(valueToSelect);
      else current.add(valueToSelect);
      nextValue = Array.from(current);
    } else {
      nextValue = valueToSelect;
    }

    onValueChange?.(nextValue);
    if (value === undefined) setUncontrolledValue(nextValue);
  }

  function orderedItems() {
    return Array.from(items.current.values())
      .filter((item) => !item.disabled)
      .sort((first, second) => {
        const position = first.compareDocumentPosition(second);
        return position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
      });
  }

  function moveFocus(
    currentValue: string,
    direction: "next" | "previous" | "first" | "last",
  ) {
    const enabledItems = orderedItems();
    if (enabledItems.length === 0) return;
    const current = items.current.get(currentValue);
    const index = current ? enabledItems.indexOf(current) : -1;
    let target = 0;

    if (direction === "last") target = enabledItems.length - 1;
    if (direction === "next") target = (index + 1) % enabledItems.length;
    if (direction === "previous") {
      target = (index - 1 + enabledItems.length) % enabledItems.length;
    }

    const item = enabledItems[target];
    item?.focus();
    if (item?.dataset.buttonGroupValue) {
      setActiveValue(item.dataset.buttonGroupValue);
    }
  }

  const context: ButtonGroupContextValue = {
    activeValue,
    disabled,
    isSelected: selected,
    isTabStop: (itemValue) => {
      if (activeValue) return activeValue === itemValue;
      return orderedItems()[0]?.dataset.buttonGroupValue === itemValue;
    },
    orientation,
    registerItem,
    rounded,
    select,
    selectionMode,
    setActiveValue,
    moveFocus,
  };

  return (
    <ButtonGroupContext.Provider value={context}>
      <div
        role="toolbar"
        aria-orientation={orientation}
        className={twMerge(
          [
            // Layout
            "inline-flex w-fit",
            orientation === "horizontal" ? "flex-row" : "flex-col",

            // Shared brutal shadow
            "shadow-[var(--shadow)]",
            rounded && "rounded-[var(--radius)]",
            className,
          ]
            .filter(Boolean)
            .join(" "),
        )}
        data-orientation={orientation}
        data-selection-mode={selectionMode}
        {...props}
      >
        {children}
      </div>
    </ButtonGroupContext.Provider>
  );
}

// Button group item styles
const buttonGroupItemStyles = cva(
  [
    // Layout and border
    "relative inline-flex items-center justify-center gap-2 border-[3px] border-border",

    // Typography
    "font-mono font-bold uppercase tracking-wide",

    // Interaction
    "transition-colors duration-200 hover:z-10 hover:bg-main hover:text-main-foreground",

    // Keyboard focus
    "focus-visible:z-20 focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-ring focus-visible:ring-offset-2",

    // Disabled state and reduced motion
    "disabled:pointer-events-none disabled:bg-disabled disabled:text-disabled-foreground",
    "motion-reduce:transition-none",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: "bg-main text-main-foreground",
        secondary: "bg-chart-2 text-main-foreground",
        outline: "bg-[var(--surface)] text-[var(--surface-foreground)]",
      },
      size: {
        sm: "px-3 py-2 text-xs",
        md: "px-5 py-3 text-sm",
        lg: "px-7 py-4 text-base",
      },
      selected: {
        true: "z-10 bg-main text-main-foreground",
        false: "",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "md",
      selected: false,
    },
  },
);

// Button group item props
export type ButtonGroupItemProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonGroupItemStyles> & {
    value: string;
  };

// Roving-focus button and optional selection item.
export const ButtonGroupItem = forwardRef<
  HTMLButtonElement,
  ButtonGroupItemProps
>(function ButtonGroupItem(
  {
    value,
    variant,
    size,
    className,
    disabled,
    onClick,
    onFocus,
    onKeyDown,
    type = "button",
    ...props
  },
  forwardedRef,
) {
  const group = useButtonGroup();
  const registerItem = group.registerItem;
  const selected = group.isSelected(value);
  const isDisabled = group.disabled || disabled;

  const setRefs = useCallback(
    (item: HTMLButtonElement | null) => {
      registerItem(value, item);
      if (typeof forwardedRef === "function") forwardedRef(item);
      else if (forwardedRef) forwardedRef.current = item;
    },
    [forwardedRef, registerItem, value],
  );

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    onClick?.(event);
    if (!event.defaultPrevented && !isDisabled) group.select(value);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;

    const previousKey =
      group.orientation === "horizontal" ? "ArrowLeft" : "ArrowUp";
    const nextKey =
      group.orientation === "horizontal" ? "ArrowRight" : "ArrowDown";
    const direction =
      event.key === previousKey
        ? "previous"
        : event.key === nextKey
          ? "next"
          : event.key === "Home"
            ? "first"
            : event.key === "End"
              ? "last"
              : null;

    if (direction) {
      event.preventDefault();
      group.moveFocus(value, direction);
    }
  }

  return (
    <button
      ref={setRefs}
      type={type}
      className={twMerge(
        [
          buttonGroupItemStyles({ variant, size, selected }),

          // Collapse adjacent 3px borders
          group.orientation === "horizontal"
            ? "-ms-[3px] first:ms-0"
            : "-mt-[3px] first:mt-0",

          // Optional outer group radius
          group.rounded &&
            group.orientation === "horizontal" &&
            "first:rounded-s-[var(--radius)] last:rounded-e-[var(--radius)]",
          group.rounded &&
            group.orientation === "vertical" &&
            "first:rounded-t-[var(--radius)] last:rounded-b-[var(--radius)]",
          className,
        ]
          .filter(Boolean)
          .join(" "),
      )}
      disabled={isDisabled}
      tabIndex={group.isTabStop(value) ? 0 : -1}
      aria-pressed={group.selectionMode === "none" ? undefined : selected}
      data-button-group-value={value}
      data-state={selected ? "on" : "off"}
      onClick={handleClick}
      onFocus={(event) => {
        group.setActiveValue(value);
        onFocus?.(event);
      }}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
});

// Compound and named APIs
// eslint-disable-next-line react-refresh/only-export-components
export const ButtonGroup = Object.assign(ButtonGroupRoot, {
  Item: ButtonGroupItem,
});

export default ButtonGroup;
