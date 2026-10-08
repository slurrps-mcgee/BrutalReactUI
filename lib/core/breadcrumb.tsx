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

const breadcrumbStyles = cva("font-mono font-bold uppercase tracking-wide", {
  variants: {
    variant: {
      primary: "text-main",
      secondary: "text-chart-2",
      outline: "text-[var(--surface-foreground)]",
    },
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

type BreadcrumbStyleProps = VariantProps<typeof breadcrumbStyles>;

const BreadcrumbContext = createContext<BreadcrumbStyleProps>({
  variant: "outline",
  size: "md",
});

export type BreadcrumbProps = HTMLAttributes<HTMLElement> &
  BreadcrumbStyleProps & {
    label?: string;
  };

export default function Breadcrumb({
  className,
  variant,
  size,
  label = "Breadcrumb",
  ...props
}: BreadcrumbProps) {
  return (
    <BreadcrumbContext.Provider value={{ variant, size }}>
      <nav
        aria-label={label}
        className={twMerge(breadcrumbStyles({ variant, size }), className)}
        {...props}
      />
    </BreadcrumbContext.Provider>
  );
}

export type BreadcrumbListProps = HTMLAttributes<HTMLOListElement>;

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

export type BreadcrumbItemProps = HTMLAttributes<HTMLLIElement>;

export function BreadcrumbItem({ className, ...props }: BreadcrumbItemProps) {
  return (
    <li
      className={twMerge("inline-flex min-w-0 items-center gap-2", className)}
      {...props}
    />
  );
}

const linkStyles = cva(
  [
    "inline-flex items-center border-b-2 border-current",
    "transition-colors duration-200",
    "hover:text-main focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-ring focus-visible:ring-offset-2",
    "aria-disabled:pointer-events-none aria-disabled:border-transparent",
    "aria-disabled:text-disabled-foreground",
    "motion-reduce:transition-none",
  ].join(" "),
  {
    variants: {
      active: {
        true: "border-transparent text-foreground",
        false: "",
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

export type BreadcrumbLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  active?: boolean;
  disabled?: boolean;
};

export function BreadcrumbLink({
  href,
  active = false,
  disabled = false,
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
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}

export type BreadcrumbPageProps = HTMLAttributes<HTMLSpanElement> & {
  disabled?: boolean;
};

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

export type BreadcrumbSeparatorProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
};

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
