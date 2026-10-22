import {
  createContext,
  useContext,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

// Pagination styles. The nav only publishes the page colors and size.
const paginationStyles = cva("", {
  variants: {
    // Page fill and ink, read by each link.
    variant: {
      primary: "[--page-bg:var(--main)] [--page-fg:var(--main-foreground)]",
      secondary:
        "[--page-bg:var(--chart-2)] [--page-fg:var(--main-foreground)]",
      outline:
        "[--page-bg:var(--surface)] [--page-fg:var(--surface-foreground)]",
    },
    // Control size and type size
    size: {
      sm: "[--page-size:2.25rem] text-xs",
      md: "[--page-size:2.75rem] text-sm",
      lg: "[--page-size:3.5rem] text-base",
    },
  },
  defaultVariants: {
    variant: "outline",
    size: "md",
  },
});

// Page link styles
const pageLinkStyles = cva(
  [
    // Layout
    "inline-flex size-[var(--page-size)] items-center justify-center",

    // Border, fill, and typography
    "border-[length:var(--border-width)] border-border bg-[var(--page-bg)] text-[var(--page-fg)]",
    "font-mono font-bold uppercase",

    // Hover
    "transition-colors duration-150 hover:bg-main hover:text-main-foreground",

    // Keyboard focus
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    "focus-visible:ring-offset-2",

    // Disabled state and reduced motion
    "aria-disabled:pointer-events-none aria-disabled:bg-disabled",
    "aria-disabled:text-disabled-foreground aria-disabled:shadow-none",
    "motion-reduce:transition-none",
  ].join(" "),
  {
    variants: {
      // Current page
      active: {
        true: "bg-main text-main-foreground",
        false: "",
      },
      // Previous and next need room for a label.
      wide: {
        true: "w-auto gap-2 px-3",
        false: "",
      },
    },
    defaultVariants: {
      active: false,
      wide: false,
    },
  },
);

type PaginationStyleProps = VariantProps<typeof paginationStyles>;
const PaginationContext = createContext<PaginationStyleProps>({
  variant: "outline",
  size: "md",
});

export type PaginationProps = HTMLAttributes<HTMLElement> &
  PaginationStyleProps & {
    label?: string;
    rounded?: boolean;
    disabled?: boolean;
  };

export default function Pagination({
  className,
  variant,
  size,
  label = "Pagination",
  rounded = false,
  disabled = false,
  ...props
}: PaginationProps) {
  return (
    <PaginationContext.Provider value={{ variant, size }}>
      <nav
        aria-label={label}
        aria-disabled={disabled || undefined}
        className={twMerge(
          paginationStyles({ variant, size }),
          rounded && "rounded-[var(--radius)]",
          disabled && "pointer-events-none opacity-70",
          className,
        )}
        {...props}
      />
    </PaginationContext.Provider>
  );
}

export type PaginationLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  active?: boolean;
  disabled?: boolean;
  rounded?: boolean;
  shadow?: boolean;
  border?: boolean;
  wrapperClassName?: string;
  faceClassName?: string;
};

type PaginationDirectionProps = PaginationLinkProps & {
  label?: string;
  children?: ReactNode;
};

export function PaginationList({
  className,
  ...props
}: HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      className={twMerge(
        [
          // Layout
          "flex list-none flex-wrap items-center gap-2",
          className,
        ]
          .filter(Boolean)
          .join(" "),
      )}
      {...props}
    />
  );
}

export function PaginationItem(props: HTMLAttributes<HTMLLIElement>) {
  return <li {...props} />;
}

export function PaginationLink({
  href,
  active = false,
  disabled = false,
  rounded = false,
  shadow = true,
  border = true,
  wrapperClassName,
  faceClassName,
  className,
  ...props
}: PaginationLinkProps) {
  const { variant, size } = useContext(PaginationContext);
  const face = (
    <a
      href={disabled ? undefined : href}
      aria-current={active ? "page" : undefined}
      aria-disabled={disabled || undefined}
      className={twMerge(
        paginationStyles({ variant, size }),
        pageLinkStyles({ active }),
        !border && "border-none",
        rounded && "rounded-[var(--radius)]",
        faceClassName,
        className,
      )}
      {...props}
    />
  );

  if (!shadow && !wrapperClassName) return face;

  return (
    <span
      className={twMerge(
        "relative isolate inline-flex",
        shadow && !disabled && "shadow-[var(--shadow)]",
        rounded && "rounded-[var(--radius)]",
        wrapperClassName,
      )}
    >
      {face}
    </span>
  );
}

export function PaginationPrevious({
  label = "Previous page",
  children,
  className,
  href,
  disabled = false,
  active = false,
  rounded = false,
  shadow = true,
  border = true,
  wrapperClassName,
  faceClassName,
  ...props
}: PaginationDirectionProps) {
  const { variant, size } = useContext(PaginationContext);
  const face = (
    <a
      href={disabled ? undefined : href}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      aria-disabled={disabled || undefined}
      className={twMerge(
        paginationStyles({ variant, size }),
        pageLinkStyles({ active, wide: true }),
        !border && "border-none",
        rounded && "rounded-[var(--radius)]",
        faceClassName,
        className,
      )}
      {...props}
    >
      <ChevronLeft aria-hidden="true" className="size-4" />
      {children ?? "Previous"}
    </a>
  );

  if (!shadow && !wrapperClassName) return face;

  return (
    <span
      className={twMerge(
        "relative isolate inline-flex",
        shadow && !disabled && "shadow-[var(--shadow)]",
        rounded && "rounded-[var(--radius)]",
        wrapperClassName,
      )}
    >
      {face}
    </span>
  );
}

export function PaginationNext({
  label = "Next page",
  children,
  className,
  href,
  disabled = false,
  active = false,
  rounded = false,
  shadow = true,
  border = true,
  wrapperClassName,
  faceClassName,
  ...props
}: PaginationDirectionProps) {
  const { variant, size } = useContext(PaginationContext);
  const face = (
    <a
      href={disabled ? undefined : href}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      aria-disabled={disabled || undefined}
      className={twMerge(
        paginationStyles({ variant, size }),
        pageLinkStyles({ active, wide: true }),
        !border && "border-none",
        rounded && "rounded-[var(--radius)]",
        faceClassName,
        className,
      )}
      {...props}
    >
      {children ?? "Next"}
      <ChevronRight aria-hidden="true" className="size-4" />
    </a>
  );

  if (!shadow && !wrapperClassName) return face;

  return (
    <span
      className={twMerge(
        "relative isolate inline-flex",
        shadow && !disabled && "shadow-[var(--shadow)]",
        rounded && "rounded-[var(--radius)]",
        wrapperClassName,
      )}
    >
      {face}
    </span>
  );
}

export function PaginationEllipsis({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      aria-hidden="true"
      className={twMerge(
        "inline-flex size-[var(--page-size)] items-center justify-center",
        className,
      )}
      {...props}
    >
      <MoreHorizontal className="size-5" />
    </span>
  );
}
