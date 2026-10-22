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
import DrawBorder from "../utils/draw-border";
import {
  SurfaceProvider,
  borderPaintClass,
  faceRadiusClass,
  useSurfaceAnimate,
  useSurfaceFlag,
} from "../utils/surface";
import {
  useAnimationTrigger,
  type AnimationTrigger,
} from "../utils/use-enter-viewport";

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
  border?: boolean;
  shadow?: boolean;
  animate?: AnimationTrigger;
  faceClassName?: string;
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
  rounded: roundedProp,
  border: borderProp,
  shadow: shadowProp,
  animate: animateProp,
  faceClassName,
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
  // The shell radius is this panel's own prop. Parents such as Accordion
  // round the first and last item themselves, and still pass radius to controls inside.
  const inheritedRounded = useSurfaceFlag(undefined, "rounded", false);
  const rounded = roundedProp ?? false;
  const border = useSurfaceFlag(borderProp, "border", true);
  const shadow = useSurfaceFlag(shadowProp, "shadow", false);
  const animate = useSurfaceAnimate(animateProp);
  const { ref, shouldAnimate } = useAnimationTrigger<HTMLDivElement>(animate);
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
      <SurfaceProvider rounded={roundedProp ?? inheritedRounded}>
        <div
          ref={ref}
          className={twMerge(
            [
              // Layout
              "w-full",

              // Hard offset. A flat panel stays put.
              shadow && "shadow-[var(--shadow)]",
              rounded && "rounded-[var(--radius)]",

              // Animation
              shouldAnimate && "animate-brutal-pop",

              // Disabled state
              disabled && "opacity-60",
              className,
            ]
              .filter(Boolean)
              .join(" "),
          )}
          data-state={isOpen ? "open" : "closed"}
          data-disabled={disabled ? "" : undefined}
          data-pop-direction={shouldAnimate ? "out" : undefined}
          {...props}
        >
          <div
            data-collapse-face
            className={twMerge(
              [
                // Border, fill, and ink.
                "relative bg-[var(--surface)] text-[var(--surface-foreground)]",

                // Drawn stroke, or the resting border. border false drops both.
                shouldAnimate && border ? "border-none" : borderPaintClass(border),

                // Width an end trigger subtracts so its fill follows the stroke.
                border ? "[--collapse-stroke:var(--border-width)]" : "[--collapse-stroke:0px]",
                rounded && "[--face-radius:var(--radius)]",

                // Pop target. Must be the wrapper's direct child.
                shouldAnimate && "brutal-pop-face",
                faceRadiusClass(rounded),
                faceClassName,
              ]
                .filter(Boolean)
                .join(" "),
            )}
          >
            {shouldAnimate && border && (
              <DrawBorder
                animate
                radius={rounded ? "var(--radius)" : undefined}
                className="z-20"
              />
            )}
            <div
              className={twMerge(
                rounded &&
                  "overflow-hidden rounded-[max(0px,calc(var(--radius)-var(--border-width)))]",
              )}
            >
              {children}
            </div>
          </div>
        </div>
      </SurfaceProvider>
    </CollapseContext.Provider>
  );
}

// Collapse trigger props
export type CollapseTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  hideIndicator?: boolean;
  rounded?: boolean;
  border?: boolean;
  shadow?: boolean;
};

// Collapse content props
export type CollapseContentProps = HTMLAttributes<HTMLDivElement> & {
  innerClassName?: string;
  border?: boolean;
  rounded?: boolean;
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
    rounded,
    border,
    shadow,
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
          rounded === false && "!rounded-none",
          rounded && "rounded-[var(--radius)]",
          border && "border-b-[length:var(--border-width)] border-border",
          shadow && "shadow-[var(--shadow)]",
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

// Grid rows animate to the content's measured intrinsic height without
// hard-coding a maximum height.
export const CollapseContent = forwardRef<HTMLDivElement, CollapseContentProps>(
  function CollapseContent(
    {
      className,
      innerClassName,
      border,
      rounded,
      children,
      onTransitionEnd,
      style,
      ...props
    },
    ref,
  ) {
    const context = useCollapse();
    const showBorder = useSurfaceFlag(border, "border", true);

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
              "p-4",
              showBorder && "border-t-[length:var(--border-width)] border-border",
              rounded && "rounded-[var(--radius)]",
              rounded === false && "!rounded-none",
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
