import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
  type TransitionEvent,
} from "react";
import { twMerge } from "tailwind-merge";
import { ChevronDown } from "lucide-react";

type CollapseContextValue = {
  contentId: string;
  disabled: boolean;
  duration: number;
  open: boolean;
  triggerId: string;
  setOpen: (open: boolean) => void;
  finishTransition: (open: boolean) => void;
};

const CollapseContext = createContext<CollapseContextValue | null>(null);

function useCollapse() {
  const context = useContext(CollapseContext);
  if (!context) {
    throw new Error("Collapse parts must render inside Collapse");
  }
  return context;
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

// Collapse props
export type CollapseProps = HTMLAttributes<HTMLDivElement> & {
  open?: boolean;
  defaultOpen?: boolean;
  disabled?: boolean;
  rounded?: boolean;
  duration?: number;
  onOpenChange?: (open: boolean) => void;
  onOpenStart?: () => void;
  onOpenEnd?: () => void;
  onCloseStart?: () => void;
  onCloseEnd?: () => void;
  children?: ReactNode;
};

// Main Collapse component
export default function Collapse({
  open,
  defaultOpen = false,
  disabled = false,
  rounded = false,
  duration = 300,
  onOpenChange,
  onOpenStart,
  onOpenEnd,
  onCloseStart,
  onCloseEnd,
  className,
  children,
  ...props
}: CollapseProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isOpen = open ?? uncontrolledOpen;
  const triggerId = useId();
  const contentId = useId();
  const previousOpen = useRef(isOpen);
  const pendingEnd = useRef<boolean | null>(null);

  function finishTransition(nextOpen: boolean) {
    if (pendingEnd.current !== nextOpen) return;
    pendingEnd.current = null;
    if (nextOpen) onOpenEnd?.();
    else onCloseEnd?.();
  }

  function setOpen(nextOpen: boolean) {
    if (disabled || nextOpen === isOpen) return;
    onOpenChange?.(nextOpen);
    if (open === undefined) setUncontrolledOpen(nextOpen);
  }

  // Announce each state transition. Reduced motion has no transition event,
  // so its completion callback follows the start callback immediately.
  useEffect(() => {
    if (previousOpen.current === isOpen) return;
    previousOpen.current = isOpen;
    pendingEnd.current = isOpen;

    if (isOpen) onOpenStart?.();
    else onCloseStart?.();

    if (prefersReducedMotion() || duration === 0) {
      pendingEnd.current = null;
      if (isOpen) onOpenEnd?.();
      else onCloseEnd?.();
    }
  }, [duration, isOpen, onCloseEnd, onCloseStart, onOpenEnd, onOpenStart]);

  return (
    <CollapseContext.Provider
      value={{
        contentId,
        disabled,
        duration,
        open: isOpen,
        triggerId,
        setOpen,
        finishTransition,
      }}
    >
      <div
        className={twMerge(
          [
            // Layout and surface
            "w-full border-[3px] border-border",
            "bg-[var(--surface)] text-[var(--surface-foreground)]",
            rounded && "overflow-hidden rounded-[var(--radius)]",

            // Disabled state
            disabled && "opacity-60",
            className,
          ]
            .filter(Boolean)
            .join(" "),
        )}
        data-state={isOpen ? "open" : "closed"}
        data-disabled={disabled ? "" : undefined}
        {...props}
      >
        {children}
      </div>
    </CollapseContext.Provider>
  );
}

// Collapse trigger props
export type CollapseTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  hideIndicator?: boolean;
};

// Button that controls the collapse content.
export const CollapseTrigger = forwardRef<
  HTMLButtonElement,
  CollapseTriggerProps
>(function CollapseTrigger(
  {
    className,
    children,
    disabled,
    hideIndicator = false,
    onClick,
    type = "button",
    ...props
  },
  ref,
) {
  const context = useCollapse();
  const isDisabled = context.disabled || disabled;

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    onClick?.(event);
    if (!event.defaultPrevented && !isDisabled) {
      context.setOpen(!context.open);
    }
  }

  return (
    <button
      ref={ref}
      id={context.triggerId}
      type={type}
      className={twMerge(
        [
          // Layout
          "group/collapse flex w-full items-center justify-between gap-3 px-4 py-3 text-left",

          // Typography and interaction
          "font-mono font-bold uppercase tracking-wide",
          "transition-colors duration-200 hover:bg-main hover:text-main-foreground",

          // Keyboard focus
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-inset focus-visible:ring-ring",

          // Disabled state and reduced motion
          "disabled:pointer-events-none disabled:bg-disabled disabled:text-disabled-foreground",
          "motion-reduce:transition-none",
          className,
        ]
          .filter(Boolean)
          .join(" "),
      )}
      aria-expanded={context.open}
      aria-controls={context.contentId}
      disabled={isDisabled}
      data-state={context.open ? "open" : "closed"}
      onClick={handleClick}
      {...props}
    >
      <span className="min-w-0 flex-1">{children}</span>
      {!hideIndicator && (
        <ChevronDown
          aria-hidden="true"
          className={twMerge(
            [
              // Indicator
              "size-4 shrink-0 transition-transform duration-300 ease-out",
              context.open && "rotate-180",

              // Reduced motion
              "motion-reduce:transition-none",
            ]
              .filter(Boolean)
              .join(" "),
          )}
        />
      )}
    </button>
  );
});

// Collapse content props
export type CollapseContentProps = HTMLAttributes<HTMLDivElement> & {
  innerClassName?: string;
};

// Grid rows animate to the content's measured intrinsic height without
// hard-coding a maximum height.
export const CollapseContent = forwardRef<HTMLDivElement, CollapseContentProps>(
  function CollapseContent(
    { className, innerClassName, children, onTransitionEnd, style, ...props },
    ref,
  ) {
    const context = useCollapse();

    function handleTransitionEnd(event: TransitionEvent<HTMLDivElement>) {
      onTransitionEnd?.(event);
      if (
        !event.defaultPrevented &&
        event.target === event.currentTarget &&
        event.propertyName === "grid-template-rows"
      ) {
        context.finishTransition(context.open);
      }
    }

    return (
      <div
        ref={ref}
        id={context.contentId}
        role="region"
        className={twMerge(
          [
            // Intrinsic height animation
            "grid overflow-hidden",
            "transition-[grid-template-rows] ease-out",
            context.open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",

            // Reduced motion
            "motion-reduce:transition-none",
            className,
          ]
            .filter(Boolean)
            .join(" "),
        )}
        style={{
          transitionDuration: `${Math.max(0, context.duration)}ms`,
          ...style,
        }}
        aria-labelledby={context.triggerId}
        aria-hidden={!context.open}
        inert={!context.open ? true : undefined}
        data-state={context.open ? "open" : "closed"}
        onTransitionEnd={handleTransitionEnd}
        {...props}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={twMerge(
              "border-t-[3px] border-border p-4",
              innerClassName,
            )}
          >
            {children}
          </div>
        </div>
      </div>
    );
  },
);

// Compound API aliases
export const CollapseRoot = Collapse;
export const CollapseParts = {
  Root: Collapse,
  Trigger: CollapseTrigger,
  Content: CollapseContent,
};
