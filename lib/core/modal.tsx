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
import DrawBorder from "../utils/draw-border";
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
  animate = true,
  centered = true,
  scrollable = true,
  rounded = false,
  shadow = true,
  className,
  wrapperClassName,
  faceClassName,
  variant,
  size,
  children,
  "aria-label": ariaLabel,
  ...props
}: ModalProps) {
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
              shadow && phase !== "draw" && "shadow-[var(--shadow)]",
              rounded && "rounded-[var(--radius)]",
              wrapperClassName,
            ]
              .filter(Boolean)
              .join(" "),
          )}
          onAnimationEnd={onAnimationEnd}
        >
          {drawing && (
            <DrawBorder
              animate
              radius={rounded ? "var(--radius)" : undefined}
              className="z-30"
            />
          )}
          <div
            ref={contentRef}
            {...props}
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel}
            aria-labelledby={ariaLabel ? undefined : titleId}
            tabIndex={-1}
            className={twMerge(
              [
                modalStyles({ variant, size }),
                !scrollable && "max-h-none overflow-visible",

                // Resting stroke, or none while the SVG draws it
                drawing ? "border-none" : "border-border",

                // Pop from the shadow after the stroke completes
                "transition-[translate] duration-200 ease-out",
                faceInShadow &&
                  "translate-x-[var(--shadow-offset-x)] translate-y-[var(--shadow-offset-y)]",
                !faceInShadow && "translate-x-0 translate-y-0",
                rounded && "rounded-[var(--radius)]",
                faceClassName,
                className,
              ]
                .filter(Boolean)
                .join(" "),
            )}
            onTransitionEnd={onTransitionEnd}
          >
            <div
              className={twMerge(
                [
                  // Content appears only after the face has popped out
                  "relative z-10 flex min-h-0 flex-1 flex-col transition-opacity duration-150",
                  phase === "reveal" ? "opacity-100" : "opacity-0",
                  "motion-reduce:transition-none",
                ].join(" "),
              )}
            >
              {children}
            </div>
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
  ...props
}: HTMLAttributes<HTMLElement>) {
  const { titleId } = useModal();
  return (
    <header
      {...props}
      id={titleId}
      className={twMerge(
        [
          // Layout and divider
          "flex items-start justify-between gap-4 border-b-[3px] border-border p-5",
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
  ...props
}: HTMLAttributes<HTMLElement>) {
  useModal();
  return (
    <footer
      className={twMerge(
        [
          // Actions and divider
          "flex flex-wrap items-center justify-end gap-3 border-t-[3px] border-border p-5",
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
export type ModalCloseProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function ModalClose({
  className,
  children,
  type = "button",
  onClick,
  "aria-label": ariaLabel = "Close dialog",
  ...props
}: ModalCloseProps) {
  const { close } = useModal();

  return (
    <button
      type={type}
      aria-label={ariaLabel}
      className={twMerge(
        [
          // Compact brutal close control
          "inline-flex shrink-0 items-center justify-center border-[3px] border-border bg-main p-1 text-main-foreground",
          "shadow-[var(--shadow)] transition-transform duration-150",
          "hover:translate-x-[var(--shadow-offset-x)] hover:translate-y-[var(--shadow-offset-y)] hover:shadow-none",

          // Keyboard focus and reduced motion
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "motion-reduce:transition-none",
          className,
        ]
          .filter(Boolean)
          .join(" "),
      )}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) close();
      }}
      {...props}
    >
      {children ?? <X aria-hidden="true" className="size-4" />}
    </button>
  );
}
