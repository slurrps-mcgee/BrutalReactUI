import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type AnimationEvent,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
  type TransitionEvent,
} from "react";
import { createPortal } from "react-dom";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { X } from "lucide-react";
import Button from "./button";
import DrawBorder from "../utils/draw-border";
import { SurfaceProvider, useSurfaceAnimate, useSurfaceFlag } from "../utils/surface";
import type { AnimationTrigger } from "../utils/use-enter-viewport";
import { useControllableState } from "../utils/use-controllable-state";
import { useOverlay } from "../utils/use-overlay";

type ModalContextValue = {
  close: () => void;
  titleId: string;
};

const ModalContext = createContext<ModalContextValue | null>(null);

function useModal() {
  const context = useContext(ModalContext);
  if (!context) throw new Error("Modal parts must render inside Modal");
  return context;
}

// Modal face styles
const modalStyles = cva(
  [
    // Layout and stacking
    "relative isolate z-10 flex max-h-[calc(100dvh-2rem)] w-full flex-col overflow-auto",

    // Border and typography
    "border-[3px] font-mono font-bold",

    // Keyboard focus
    "focus:outline-none",

    // Reduced motion
    "motion-reduce:transition-none",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          // Fill and ink
          "bg-main text-main-foreground",

          // Surface tokens for nested outline controls
          "[--surface:var(--main)] [--surface-foreground:var(--main-foreground)] [--outline-button-fill:var(--chart-2)]",
        ].join(" "),
        secondary: [
          // Fill and ink
          "bg-chart-2 text-main-foreground",

          // Surface tokens for nested outline controls
          "[--surface:var(--chart-2)] [--surface-foreground:var(--main-foreground)] [--outline-button-fill:var(--main)]",
        ].join(" "),
        outline: [
          // Cut out of the surrounding surface
          "bg-secondary-background text-foreground",
          "[--surface:var(--secondary-background)] [--surface-foreground:var(--foreground)] [--outline-button-fill:var(--main)]",
        ].join(" "),
      },
      // Width and type size
      size: {
        sm: "max-w-sm text-sm",
        md: "max-w-lg text-base",
        lg: "max-w-2xl text-lg",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "md",
    },
  },
);

type ModalPhase = "draw" | "pop" | "reveal" | "closing";

// Modal props
export type ModalProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange"> &
  VariantProps<typeof modalStyles> & {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    closeOnEscape?: boolean;
    closeOnBackdrop?: boolean;
    animate?: boolean;
    centered?: boolean;
    scrollable?: boolean;
    rounded?: boolean;
    shadow?: boolean;
    border?: boolean;
    disabled?: boolean;
    wrapperClassName?: string;
    faceClassName?: string;
    children?: ReactNode;
  };

// Main Modal component
export default function Modal({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  closeOnEscape = true,
  closeOnBackdrop = true,
  animate: animateProp,
  centered = true,
  scrollable = true,
  rounded: roundedProp,
  shadow: shadowProp,
  border: borderProp,
  disabled = false,
  className,
  wrapperClassName,
  faceClassName,
  variant,
  size,
  children,
  "aria-label": ariaLabel,
  ...props
}: ModalProps) {
  const animate = Boolean(useSurfaceAnimate(animateProp));
  const rounded = useSurfaceFlag(roundedProp, "rounded", false);
  const shadow = useSurfaceFlag(shadowProp, "shadow", true);
  const border = useSurfaceFlag(borderProp, "border", true);
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const [present, setPresent] = useState(open);
  const [phase, setPhase] = useState<ModalPhase>("draw");
  const contentRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const close = useCallback(() => setOpen(false), [setOpen]);

  useOverlay({
    open: open && present,
    contentRef,
    onClose: close,
    closeOnEscape,
  });

  // Start with the border, then pop the face out of its shadow.
  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const frame = requestAnimationFrame(() => {
      if (open) {
        setPresent(true);
        setPhase(!animate || reduced ? "reveal" : "draw");
        return;
      }

      if (!animate || reduced) {
        setPresent(false);
        return;
      }
      if (present) setPhase("closing");
    });
    return () => cancelAnimationFrame(frame);
  }, [animate, open, present]);

  // DrawBorder normally reports completion; this keeps the sequence moving
  // if an environment suppresses animation events.
  useEffect(() => {
    if (!open || phase !== "draw" || !animate) return;
    const timer = window.setTimeout(() => setPhase("pop"), 900);
    return () => window.clearTimeout(timer);
  }, [animate, open, phase]);

  useEffect(() => {
    if (!open || phase !== "pop") return;
    const timer = window.setTimeout(() => setPhase("reveal"), 250);
    return () => window.clearTimeout(timer);
  }, [open, phase]);

  // A close during the border draw has no translate change to report.
  useEffect(() => {
    if (open || phase !== "closing") return;
    const timer = window.setTimeout(() => setPresent(false), 250);
    return () => window.clearTimeout(timer);
  }, [open, phase]);

  const onAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.animationName === "drawBorder" && open && phase === "draw") {
      setPhase("pop");
    }
  };

  const onTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (
      event.target !== event.currentTarget ||
      event.propertyName !== "translate"
    ) {
      return;
    }
    if (phase === "pop") setPhase("reveal");
    if (phase === "closing") setPresent(false);
  };

  const onBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && closeOnBackdrop) close();
  };

  if (!present || typeof document === "undefined") return null;

  const drawing = animate && phase === "draw";
  const faceInShadow = phase === "draw" || phase === "closing";

  return createPortal(
    <ModalContext.Provider value={{ close, titleId }}>
      <div
        className={twMerge(
          [
            // Viewport layer and backdrop
            "fixed inset-0 z-50 flex justify-center overflow-y-auto bg-overlay p-4",
            centered ? "items-center" : "items-start",

            // Backdrop entrance
            "transition-opacity duration-200 ease-out",
            phase === "closing" && "opacity-0",
            "motion-reduce:transition-none",
          ]
            .filter(Boolean)
            .join(" "),
        )}
        onMouseDown={onBackdropClick}
      >
        <div
          className={twMerge(
            [
              // Size and hard shadow
              "relative isolate w-full",
              size === "sm" && "max-w-sm",
              (!size || size === "md") && "max-w-lg",
              size === "lg" && "max-w-2xl",
              (shadow || animate) &&
                phase !== "draw" &&
                "shadow-[var(--shadow)]",
              rounded && "rounded-[var(--radius)]",
              wrapperClassName,
            ]
              .filter(Boolean)
              .join(" "),
          )}
          onAnimationEnd={onAnimationEnd}
        >
          <div
            ref={contentRef}
            {...props}
            role="dialog"
            aria-modal="true"
            aria-disabled={disabled || undefined}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabel ? undefined : titleId}
            tabIndex={-1}
            className={twMerge(
              [
                modalStyles({ variant, size }),
                !scrollable && "max-h-none overflow-visible",

                // Resting stroke, or none while the SVG draws it.
                // The drawn stroke sits just outside the face, so the face must not clip it.
                !border
                  ? "overflow-visible border-none"
                  : drawing
                    ? "overflow-visible border-transparent"
                    : "border-border",

                // Pop from the shadow after the stroke completes.
                "transition-[translate] duration-200 ease-out",
                faceInShadow &&
                  "translate-x-[var(--shadow-offset-x)] translate-y-[var(--shadow-offset-y)]",
                !faceInShadow && "translate-x-0 translate-y-0",
                rounded && "rounded-[var(--radius)]",
                disabled && "pointer-events-none opacity-70",
                faceClassName,
                className,
              ]
                .filter(Boolean)
                .join(" "),
            )}
            onTransitionEnd={onTransitionEnd}
          >
            {/* Border. On the face so the stroke stays with the panel while it pops. */}
            {drawing && border && (
              <DrawBorder
                animate
                radius={rounded ? "var(--radius)" : undefined}
                className="z-30"
              />
            )}
            <SurfaceProvider
              shadow={shadow || animate}
              border={border}
              rounded={rounded}
              animate={animate}
            >
              <div className="relative z-10 flex min-h-0 flex-1 flex-col">
                {children}
              </div>
            </SurfaceProvider>
          </div>
        </div>
      </div>
    </ModalContext.Provider>,
    document.body,
  );
}

// Modal header
export function ModalHeader({
  className,
  border,
  rounded,
  shadow,
  ...props
}: HTMLAttributes<HTMLElement> & {
  border?: boolean;
  rounded?: boolean;
  shadow?: boolean;
}) {
  const { titleId } = useModal();
  const showBorder = useSurfaceFlag(border, "border", true);
  return (
    <header
      {...props}
      id={titleId}
      className={twMerge(
        [
          // Layout and divider. border follows the dialog unless this header sets it.
          "flex items-start justify-between gap-4 p-5",
          showBorder && "border-b-[3px] border-border",
          rounded && "rounded-[var(--radius)]",
          shadow && "shadow-[var(--shadow)]",
          className,
        ]
          .filter(Boolean)
          .join(" "),
      )}
    />
  );
}

// Modal body
export function ModalBody({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  useModal();
  return (
    <div
      className={twMerge("min-h-0 flex-1 overflow-auto p-5", className)}
      {...props}
    />
  );
}

// Modal footer
export function ModalFooter({
  className,
  border,
  rounded,
  shadow,
  ...props
}: HTMLAttributes<HTMLElement> & {
  border?: boolean;
  rounded?: boolean;
  shadow?: boolean;
}) {
  useModal();
  const showBorder = useSurfaceFlag(border, "border", true);
  return (
    <footer
      className={twMerge(
        [
          // Actions and divider. border follows the dialog unless this footer sets it.
          "flex flex-wrap items-center justify-end gap-3 p-5",
          showBorder && "border-t-[3px] border-border",
          rounded && "rounded-[var(--radius)]",
          shadow && "shadow-[var(--shadow)]",
          className,
        ]
          .filter(Boolean)
          .join(" "),
      )}
      {...props}
    />
  );
}

// Modal close control
export type ModalCloseProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  rounded?: boolean;
  shadow?: boolean;
  border?: boolean;
  animate?: AnimationTrigger;
};

export function ModalClose({
  className,
  children,
  type = "button",
  onClick,
  rounded,
  shadow,
  border,
  animate,
  "aria-label": ariaLabel,
  ...props
}: ModalCloseProps) {
  const { close } = useModal();
  const iconOnly = children == null;

  return (
    <Button
      {...props}
      type={type}
      variant="primary"
      size={iconOnly ? "sm" : "md"}
      rounded={rounded}
      shadow={shadow}
      border={border}
      animate={animate}
      aria-label={ariaLabel ?? (iconOnly ? "Close dialog" : undefined)}
      className={className}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) close();
      }}
    >
      {children ?? <X aria-hidden="true" className="size-4" />}
    </Button>
  );
}
