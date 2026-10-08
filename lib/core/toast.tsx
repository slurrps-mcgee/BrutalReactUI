/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cva, type VariantProps } from "class-variance-authority";
import {
  Bell,
  CheckCircle2,
  Info,
  TriangleAlert,
  X,
  XCircle,
} from "lucide-react";
import { twMerge } from "tailwind-merge";
import { usePresence } from "../utils/use-presence";

export type ToastVariant =
  "primary" | "secondary" | "success" | "warning" | "danger" | "info";

export type ToastPosition =
  "top-left" | "top-right" | "bottom-left" | "bottom-right";

// Toast styles
const toastStyles = cva(
  [
    // Layout and stacking
    "pointer-events-auto relative isolate flex w-full items-start gap-3",

    // Border, shadow, and typography
    "border-[3px] border-border p-4 shadow-[var(--shadow)]",
    "font-mono text-sm",

    // Reduced motion
    "transition-[opacity,translate,scale] duration-200",
    "motion-reduce:transition-none",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: "bg-main text-main-foreground",
        secondary: "bg-chart-2 text-main-foreground",
        success: "bg-success text-success-foreground",
        warning: "bg-warning text-warning-foreground",
        danger: "bg-danger text-danger-foreground",
        info: "bg-info text-info-foreground",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

const variantIcons: Record<ToastVariant, typeof Bell> = {
  primary: Bell,
  secondary: Bell,
  success: CheckCircle2,
  warning: TriangleAlert,
  danger: XCircle,
  info: Info,
};

// Toast props
export type ToastProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> &
  VariantProps<typeof toastStyles> & {
    title?: ReactNode;
    description?: ReactNode;
    action?: ReactNode;
    icon?: ReactNode | false;
    dismissible?: boolean;
    timer?: number;
    duration?: number;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    onDismiss?: () => void;
    rounded?: boolean;
  };

// Main Toast component
export function Toast({
  className,
  variant = "primary",
  title,
  description,
  action,
  icon,
  dismissible = true,
  timer,
  duration = 0,
  open: controlledOpen,
  defaultOpen = true,
  onOpenChange,
  onDismiss,
  rounded = false,
  role,
  ...props
}: ToastProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = controlledOpen ?? uncontrolledOpen;
  const displayDuration = timer ?? duration;
  const { present, visible } = usePresence(open, 200);
  const onOpenChangeRef = useRef(onOpenChange);
  const onDismissRef = useRef(onDismiss);

  useEffect(() => {
    onOpenChangeRef.current = onOpenChange;
    onDismissRef.current = onDismiss;
  }, [onDismiss, onOpenChange]);

  const dismiss = useCallback(() => {
    if (controlledOpen === undefined) setUncontrolledOpen(false);
    onOpenChangeRef.current?.(false);
    onDismissRef.current?.();
  }, [controlledOpen]);

  useEffect(() => {
    if (!open || displayDuration <= 0) return;
    const timeout = window.setTimeout(dismiss, displayDuration);
    return () => window.clearTimeout(timeout);
  }, [dismiss, displayDuration, open]);

  if (!present) return null;

  const Icon = variantIcons[variant ?? "primary"];

  return (
    <div
      role={role ?? (variant === "danger" ? "alert" : "status")}
      className={twMerge(
        toastStyles({ variant }),
        visible
          ? "translate-x-0 scale-100 opacity-100"
          : "translate-x-3 scale-95 opacity-0",
        rounded && "rounded-[var(--radius)]",
        className,
      )}
      {...props}
    >
      {/* Icon */}
      {icon !== false && (
        <span className="mt-0.5 shrink-0" aria-hidden="true">
          {icon ?? <Icon className="size-5" />}
        </span>
      )}

      {/* Content */}
      <div className="min-w-0 flex-1">
        {title && (
          <div className="font-bold uppercase tracking-wide">{title}</div>
        )}
        {description && (
          <div className="mt-1 leading-relaxed">{description}</div>
        )}
      </div>

      {/* Actions */}
      {action && <div className="shrink-0">{action}</div>}
      {dismissible && (
        <button
          type="button"
          aria-label="Dismiss notification"
          className={twMerge(
            [
              // Layout and interaction
              "-m-1 inline-flex shrink-0 p-1",
              "transition-transform duration-150 hover:scale-110 active:scale-90",

              // Keyboard focus
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",

              // Reduced motion
              "motion-reduce:transition-none",
            ].join(" "),
          )}
          onClick={dismiss}
        >
          <X aria-hidden="true" className="size-5" />
        </button>
      )}
    </div>
  );
}

export type ToastInput = Omit<
  ToastProps,
  "open" | "defaultOpen" | "onOpenChange" | "onDismiss"
> & {
  id?: string;
};

type ToastRecord = ToastInput & {
  id: string;
  closing?: boolean;
};

export type ToastContextValue = {
  toast: (toast: ToastInput) => string;
  dismiss: (id?: string) => void;
  toasts: readonly ToastRecord[];
  available: boolean;
};

const fallbackToastContext: ToastContextValue = {
  toast: () => "",
  dismiss: () => undefined,
  toasts: [],
  available: false,
};

const ToastContext = createContext<ToastContextValue | null>(null);

// Toast provider props
export type ToastProviderProps = {
  children?: ReactNode;
  timer?: number;
  duration?: number;
  maxToasts?: number;
};

// Stores imperative toasts. Render ToastViewport anywhere beneath this provider.
export function ToastProvider({
  children,
  timer,
  duration = 5000,
  maxToasts = 5,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const counter = useRef(0);

  const dismiss = useCallback((id?: string) => {
    setToasts((current) =>
      current.map((toast) =>
        id === undefined || toast.id === id
          ? { ...toast, closing: true }
          : toast,
      ),
    );
    window.setTimeout(() => {
      setToasts((current) =>
        current.filter(
          (toast) => !(toast.closing && (id === undefined || toast.id === id)),
        ),
      );
    }, 200);
  }, []);

  const toast = useCallback(
    (input: ToastInput) => {
      const id = input.id ?? `toast-${Date.now()}-${counter.current++}`;
      const record: ToastRecord = {
        duration: timer ?? duration,
        ...input,
        id,
      };

      setToasts((current) =>
        [...current.filter((item) => item.id !== id), record].slice(
          -Math.max(1, maxToasts),
        ),
      );
      return id;
    },
    [duration, maxToasts, timer],
  );

  const value = useMemo<ToastContextValue>(
    () => ({ toast, dismiss, toasts, available: true }),
    [dismiss, toast, toasts],
  );

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
}

// Safe outside ToastProvider so optional integrations can retain local feedback.
export function useToast() {
  return useContext(ToastContext) ?? fallbackToastContext;
}

const positionStyles: Record<ToastPosition, string> = {
  "top-left": "left-4 top-4 items-start",
  "top-right": "right-4 top-4 items-end",
  "bottom-left": "bottom-4 left-4 items-start",
  "bottom-right": "bottom-4 right-4 items-end",
};

// Toast viewport props
export type ToastViewportProps = HTMLAttributes<HTMLDivElement> & {
  position?: ToastPosition;
  portal?: boolean;
};

// Fixed, stacked live region for provider-managed toasts.
export function ToastViewport({
  className,
  position = "top-right",
  portal = true,
  ...props
}: ToastViewportProps) {
  const { toasts, dismiss } = useToast();
  const viewport = (
    <div
      aria-live="polite"
      aria-relevant="additions removals"
      className={twMerge(
        [
          // Layout and stacking
          "pointer-events-none fixed z-50 flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3",
          positionStyles[position],

          // Bottom positions stack upward.
          position.startsWith("bottom") && "flex-col-reverse",
          className,
        ]
          .filter(Boolean)
          .join(" "),
      )}
      {...props}
    >
      {toasts.map(({ id, closing, ...toastProps }) => (
        <Toast
          key={id}
          {...toastProps}
          open={!closing}
          onDismiss={() => dismiss(id)}
        />
      ))}
    </div>
  );

  return portal && typeof document !== "undefined"
    ? createPortal(viewport, document.body)
    : viewport;
}

export default Toast;
