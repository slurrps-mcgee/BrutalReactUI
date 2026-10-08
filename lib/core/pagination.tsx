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

const paginationStyles = cva("", {
  variants: {
    variant: {
      primary: "[--page-bg:var(--main)] [--page-fg:var(--main-foreground)]",
      secondary:
        "[--page-bg:var(--chart-2)] [--page-fg:var(--main-foreground)]",
      outline:
        "[--page-bg:var(--surface)] [--page-fg:var(--surface-foreground)]",
    },
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

type PaginationStyleProps = VariantProps<typeof paginationStyles>;
const PaginationContext = createContext<PaginationStyleProps>({
  variant: "outline",
  size: "md",
});

export type PaginationProps = HTMLAttributes<HTMLElement> &
  PaginationStyleProps & {
    label?: string;
  };

export default function Pagination({
  className,
  variant,
  size,
  label = "Pagination",
  ...props
}: PaginationProps) {
  return (
    <PaginationContext.Provider value={{ variant, size }}>
      <nav
        aria-label={label}
        className={twMerge(paginationStyles({ variant, size }), className)}
        {...props}
      />
    </PaginationContext.Provider>
  );
}

export function PaginationList({
  className,
  ...props
}: HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      className={twMerge(
        "flex list-none flex-wrap items-center gap-2",
        className,
      )}
      {...props}
    />
  );
}

export function PaginationItem(props: HTMLAttributes<HTMLLIElement>) {
  return <li {...props} />;
}

const pageLinkStyles = cva(
  [
    "inline-flex size-[var(--page-size)] items-center justify-center",
    "border-[3px] border-border bg-[var(--page-bg)] text-[var(--page-fg)]",
    "font-mono font-bold uppercase",
    "transition-colors duration-150 hover:bg-main hover:text-main-foreground",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    "focus-visible:ring-offset-2",
    "aria-disabled:pointer-events-none aria-disabled:bg-disabled",
    "aria-disabled:text-disabled-foreground aria-disabled:shadow-none",
    "motion-reduce:transition-none",
  ].join(" "),
  {
    variants: {
      active: {
        true: "bg-main text-main-foreground",
        false: "",
      },
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

export type PaginationLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  active?: boolean;
  disabled?: boolean;
  rounded?: boolean;
};

export function PaginationLink({
  href,
  active = false,
  disabled = false,
  rounded = false,
  className,
  ...props
}: PaginationLinkProps) {
  const { variant, size } = useContext(PaginationContext);
  return (
    <a
      href={disabled ? undefined : href}
      aria-current={active ? "page" : undefined}
      aria-disabled={disabled || undefined}
      className={twMerge(
        paginationStyles({ variant, size }),
        pageLinkStyles({ active }),
        rounded && "rounded-[var(--radius)]",
        className,
      )}
      {...props}
    />
  );
}

type PaginationDirectionProps = PaginationLinkProps & {
  label?: string;
  children?: ReactNode;
};

export function PaginationPrevious({
  label = "Previous page",
  children,
  className,
  href,
  disabled = false,
  active = false,
  rounded = false,
  ...props
}: PaginationDirectionProps) {
  const { variant, size } = useContext(PaginationContext);
  return (
    <a
      href={disabled ? undefined : href}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      aria-disabled={disabled || undefined}
      className={twMerge(
        paginationStyles({ variant, size }),
        pageLinkStyles({ active, wide: true }),
        rounded && "rounded-[var(--radius)]",
        className,
      )}
      {...props}
    >
      <ChevronLeft aria-hidden="true" className="size-4" />
      {children ?? "Previous"}
    </a>
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
  ...props
}: PaginationDirectionProps) {
  const { variant, size } = useContext(PaginationContext);
  return (
    <a
      href={disabled ? undefined : href}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      aria-disabled={disabled || undefined}
      className={twMerge(
        paginationStyles({ variant, size }),
        pageLinkStyles({ active, wide: true }),
        rounded && "rounded-[var(--radius)]",
        className,
      )}
      {...props}
    >
      {children ?? "Next"}
      <ChevronRight aria-hidden="true" className="size-4" />
    </a>
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
