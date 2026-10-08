import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
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

export type AlertVariant =
  "primary" | "secondary" | "success" | "warning" | "danger" | "info";

// Alert styles
const alertStyles = cva(
  [
    // Layout and stacking
    "relative isolate flex w-full items-start gap-3",

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
        primary: [
          // Fill and ink
          "bg-main text-main-foreground",

          // Surface for nested outline controls
          "[--surface:var(--main)] [--surface-foreground:var(--main-foreground)] [--outline-button-fill:var(--chart-2)]",
        ].join(" "),
        secondary: [
          // Fill and ink
          "bg-chart-2 text-main-foreground",

          // Surface for nested outline controls
          "[--surface:var(--chart-2)] [--surface-foreground:var(--main-foreground)] [--outline-button-fill:var(--main)]",
        ].join(" "),
        success: [
          // Fill and ink
          "bg-success text-success-foreground",

          // Surface for nested outline controls
          "[--surface:var(--success)] [--surface-foreground:var(--success-foreground)] [--outline-button-fill:var(--main)]",
        ].join(" "),
        warning: [
          // Fill and ink
          "bg-warning text-warning-foreground",

          // Surface for nested outline controls
          "[--surface:var(--warning)] [--surface-foreground:var(--warning-foreground)] [--outline-button-fill:var(--main)]",
        ].join(" "),
        danger: [
          // Fill and ink
          "bg-danger text-danger-foreground",

          // Surface for nested outline controls
          "[--surface:var(--danger)] [--surface-foreground:var(--danger-foreground)] [--outline-button-fill:var(--main)]",
        ].join(" "),
        info: [
          // Fill and ink
          "bg-info text-info-foreground",

          // Surface for nested outline controls
          "[--surface:var(--info)] [--surface-foreground:var(--info-foreground)] [--outline-button-fill:var(--main)]",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

const variantIcons: Record<AlertVariant, typeof Bell> = {
  primary: Bell,
  secondary: Bell,
  success: CheckCircle2,
  warning: TriangleAlert,
  danger: XCircle,
  info: Info,
};

// Alert props
export type AlertProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> &
  VariantProps<typeof alertStyles> & {
    title?: ReactNode;
    icon?: ReactNode | false;
    actions?: ReactNode;
    dismissible?: boolean;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    onDismiss?: () => void;
    timer?: number;
    duration?: number;
    rounded?: boolean;
  };

// Main Alert component
export default function Alert({
  children,
  className,
  variant = "primary",
  title,
  icon,
  actions,
  dismissible = false,
  open: controlledOpen,
  defaultOpen = true,
  onOpenChange,
  onDismiss,
  timer,
  duration = 0,
  rounded = false,
  role,
  ...props
}: AlertProps) {
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
      role={role ?? "alert"}
      className={twMerge(
        alertStyles({ variant }),
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
        {children && (
          <div className={twMerge(title && "mt-1", "leading-relaxed")}>
            {children}
          </div>
        )}
      </div>

      {/* Actions */}
      {actions && <div className="shrink-0">{actions}</div>}
      {dismissible && (
        <button
          type="button"
          aria-label="Dismiss alert"
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
