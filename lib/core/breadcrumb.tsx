import {
  createContext,
  useContext,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { ChevronRight } from "lucide-react";

// Breadcrumb styles
const breadcrumbStyles = cva(
  [
    // Typography
    "font-mono font-bold uppercase tracking-wide",
  ].join(" "),
  {
    variants: {
      // Ink
      variant: {
        primary: "text-main",
        secondary: "text-chart-2",
        outline: "text-[var(--surface-foreground)]",
      },
      // Type size
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
    variant: "outline",
    size: "md",
  },
});

// Breadcrumb link styles
const linkStyles = cva(
  [
    // Layout and underline
    "inline-flex items-center border-b-2 border-current",

    // Hover
    "transition-colors duration-200",

    // Keyboard focus
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-ring focus-visible:ring-offset-2",

    // Disabled state and reduced motion
    "aria-disabled:pointer-events-none aria-disabled:border-none",
    "aria-disabled:text-disabled-foreground",
    "motion-reduce:transition-none",
  ].join(" "),
  {
    variants: {
      // Current crumb drops the underline.
      active: {
        true: "border-none text-foreground",
        false: "",
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

type BreadcrumbStyleProps = VariantProps<typeof breadcrumbStyles>;

const BreadcrumbContext = createContext<BreadcrumbStyleProps>({
  variant: "outline",
  size: "md",
});

export type BreadcrumbProps = HTMLAttributes<HTMLElement> &
  BreadcrumbStyleProps & {
    label?: string;
    rounded?: boolean;
    disabled?: boolean;
  };

export default function Breadcrumb({
  className,
  variant,
  size,
  label = "Breadcrumb",
  rounded = false,
  disabled = false,
  ...props
}: BreadcrumbProps) {
  return (
    <BreadcrumbContext.Provider value={{ variant, size }}>
      <nav
        aria-label={label}
        aria-disabled={disabled || undefined}
        className={twMerge(
          [
            breadcrumbStyles({ variant, size }),
            rounded && "rounded-[var(--radius)]",

            // Disabled state
            disabled && "pointer-events-none opacity-70",
            className,
          ]
            .filter(Boolean)
            .join(" "),
        )}
        {...props}
      />
    </BreadcrumbContext.Provider>
  );
}

export type BreadcrumbListProps = HTMLAttributes<HTMLOListElement>;

export type BreadcrumbItemProps = HTMLAttributes<HTMLLIElement>;

export type BreadcrumbLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  active?: boolean;
  disabled?: boolean;
  border?: boolean;
};

export type BreadcrumbPageProps = HTMLAttributes<HTMLSpanElement> & {
  disabled?: boolean;
};

export type BreadcrumbSeparatorProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
};

export function BreadcrumbList({ className, ...props }: BreadcrumbListProps) {
  return (
    <ol
      className={twMerge(
        "flex list-none flex-wrap items-center gap-2",
        className,
      )}
      {...props}
    />
  );
}

export function BreadcrumbItem({ className, ...props }: BreadcrumbItemProps) {
  return (
    <li
      className={twMerge("inline-flex min-w-0 items-center gap-2", className)}
      {...props}
    />
  );
}

export function BreadcrumbLink({
  href,
  active = false,
  disabled = false,
  border = true,
  className,
  children,
  ...props
}: BreadcrumbLinkProps) {
  const { variant, size } = useContext(BreadcrumbContext);

  return (
    <a
      href={disabled ? undefined : href}
      aria-current={active ? "page" : undefined}
      aria-disabled={disabled || undefined}
      className={twMerge(
        breadcrumbStyles({ variant, size }),
        linkStyles({ active }),
        variant === "primary" &&
          "hover:text-chart-2 focus-visible:text-chart-2",
        variant !== "primary" && "hover:text-main focus-visible:text-main",
        !border && "border-none",
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}

export function BreadcrumbPage({
  disabled = false,
  className,
  ...props
}: BreadcrumbPageProps) {
  return (
    <span
      aria-current="page"
      aria-disabled={disabled || undefined}
      className={twMerge(
        "text-foreground",
        disabled && "text-disabled-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function BreadcrumbSeparator({
  className,
  children,
  ...props
}: BreadcrumbSeparatorProps) {
  return (
    <span
      aria-hidden="true"
      className={twMerge("inline-flex shrink-0 text-foreground/60", className)}
      {...props}
    >
      {children ?? <ChevronRight className="size-[1em]" />}
    </span>
  );
}
