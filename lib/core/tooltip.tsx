import {
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type FocusEvent,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { usePresence } from "../utils/use-presence";

type TooltipContextValue = {
  open: boolean;
  tooltipId: string;
  show: () => void;
  hide: () => void;
  setFocused: (focused: boolean) => void;
};

const TooltipContext = createContext<TooltipContextValue | null>(null);

function useTooltip() {
  const context = useContext(TooltipContext);
  if (!context) throw new Error("Tooltip parts must render inside Tooltip");
  return context;
}

// Tooltip props
export type TooltipProps = HTMLAttributes<HTMLSpanElement> & {
  delay?: number;
  children?: ReactNode;
};

// Main Tooltip component
export default function Tooltip({
  delay = 400,
  className,
  children,
  onMouseEnter,
  onMouseLeave,
  ...props
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const focusedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipId = useId();

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const show = useCallback(() => {
    clearTimer();
    timerRef.current = window.setTimeout(
      () => {
        setOpen(true);
        timerRef.current = null;
      },
      Math.max(0, delay),
    );
  }, [clearTimer, delay]);

  const hide = useCallback(() => {
    clearTimer();
    if (!focusedRef.current) setOpen(false);
  }, [clearTimer]);

  const setFocused = useCallback(
    (focused: boolean) => {
      focusedRef.current = focused;
      if (focused) show();
      else hide();
    },
    [hide, show],
  );

  useEffect(() => clearTimer, [clearTimer]);

  // Escape dismisses the description without moving focus.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        clearTimer();
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [clearTimer, open]);

  return (
    <TooltipContext.Provider
      value={{ open, tooltipId, show, hide, setFocused }}
    >
      <span
        className={twMerge("relative inline-flex", className)}
        onMouseEnter={(event) => {
          onMouseEnter?.(event);
          if (!event.defaultPrevented) show();
        }}
        onMouseLeave={(event) => {
          onMouseLeave?.(event);
          if (!event.defaultPrevented) hide();
        }}
        {...props}
      >
        {children}
      </span>
    </TooltipContext.Provider>
  );
}

type TriggerChildProps = {
  "aria-describedby"?: string;
  onFocus?: (event: FocusEvent<HTMLElement>) => void;
  onBlur?: (event: FocusEvent<HTMLElement>) => void;
  ref?: Ref<HTMLElement>;
};

// Tooltip trigger props
export type TooltipTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  children: ReactNode;
};

// Tooltip trigger
export function TooltipTrigger({
  asChild = false,
  children,
  onFocus,
  onBlur,
  type = "button",
  ...props
}: TooltipTriggerProps) {
  const { open, tooltipId, setFocused } = useTooltip();

  const handleFocus = (event: FocusEvent<HTMLElement>) => {
    onFocus?.(event as FocusEvent<HTMLButtonElement>);
    if (!event.defaultPrevented) setFocused(true);
  };
  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    onBlur?.(event as FocusEvent<HTMLButtonElement>);
    if (!event.defaultPrevented) setFocused(false);
  };

  if (asChild) {
    if (!isValidElement<TriggerChildProps>(children)) {
      throw new Error("TooltipTrigger with asChild requires one React element");
    }

    const child = children as ReactElement<TriggerChildProps>;
    return cloneElement(child, {
      ...props,
      "aria-describedby": open
        ? [child.props["aria-describedby"], tooltipId].filter(Boolean).join(" ")
        : child.props["aria-describedby"],
      onFocus: (event: FocusEvent<HTMLElement>) => {
        child.props.onFocus?.(event);
        if (!event.defaultPrevented) handleFocus(event);
      },
      onBlur: (event: FocusEvent<HTMLElement>) => {
        child.props.onBlur?.(event);
        if (!event.defaultPrevented) handleBlur(event);
      },
    });
  }

  return (
    <button
      type={type}
      aria-describedby={open ? tooltipId : undefined}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    >
      {children}
    </button>
  );
}

// Tooltip face styles
const tooltipStyles = cva(
  [
    // Layout and stacking
    "pointer-events-none absolute z-50 w-max max-w-64",

    // Border and typography
    "border-[3px] border-border font-mono font-bold uppercase tracking-wide",

    // Entrance and reduced motion
    "transition-[opacity,translate] duration-150 ease-out",
    "motion-reduce:transition-none",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: "bg-main text-main-foreground",
        secondary: "bg-chart-2 text-main-foreground",
        outline: "bg-secondary-background text-foreground",
      },
      // Padding and type size
      size: {
        sm: "px-2 py-1 text-[0.625rem]",
        md: "px-3 py-1.5 text-xs",
        lg: "px-4 py-2 text-sm",
      },
      // Position relative to the trigger
      placement: {
        top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
        right: "left-full top-1/2 ml-2 -translate-y-1/2",
        bottom: "left-1/2 top-full mt-2 -translate-x-1/2",
        left: "right-full top-1/2 mr-2 -translate-y-1/2",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "md",
      placement: "top",
    },
  },
);

// Tooltip content props
export type TooltipContentProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof tooltipStyles> & {
    rounded?: boolean;
    shadow?: boolean;
  };

// Tooltip content
export function TooltipContent({
  className,
  variant,
  size,
  placement,
  rounded = false,
  shadow = true,
  children,
  ...props
}: TooltipContentProps) {
  const { open, tooltipId } = useTooltip();
  const { present, visible } = usePresence(open, 150);

  if (!present) return null;

  const hiddenOffset =
    placement === "bottom"
      ? "-translate-y-1"
      : placement === "left"
        ? "translate-x-1"
        : placement === "right"
          ? "-translate-x-1"
          : "translate-y-1";

  return (
    <span
      id={tooltipId}
      role="tooltip"
      className={twMerge(
        [
          tooltipStyles({ variant, size, placement }),

          // Optional shape and depth
          shadow && "shadow-[var(--shadow)]",
          rounded && "rounded-[var(--radius)]",

          // Keep the tooltip noninteractive while it enters and leaves
          visible ? "opacity-100" : `opacity-0 ${hiddenOffset}`,
          className,
        ]
          .filter(Boolean)
          .join(" "),
      )}
      {...props}
    >
      {children}
    </span>
  );
}
