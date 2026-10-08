import {
  createContext,
  useContext,
  type HTMLAttributes,
  type TableHTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import DrawBorder from "../utils/draw-border";
import {
  useAnimationTrigger,
  type AnimationTrigger,
} from "../utils/use-enter-viewport";

const tableStyles = cva("w-full border-collapse font-mono text-foreground", {
  variants: {
    variant: {
      primary:
        "[--table-head:var(--main)] [--table-head-fg:var(--main-foreground)] [--table-stripe:var(--secondary-background)]",
      secondary:
        "[--table-head:var(--chart-2)] [--table-head-fg:var(--main-foreground)] [--table-stripe:var(--secondary-background)]",
      outline:
        "[--table-head:var(--surface)] [--table-head-fg:var(--surface-foreground)] [--table-stripe:var(--secondary-background)]",
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

type TableStyleProps = VariantProps<typeof tableStyles>;
type TableOptions = {
  bordered: boolean;
  striped: boolean;
  hoverable: boolean;
  compact: boolean;
  stickyHeader: boolean;
  size: TableStyleProps["size"];
};

const TableContext = createContext<TableOptions>({
  bordered: false,
  striped: false,
  hoverable: false,
  compact: false,
  stickyHeader: false,
  size: "md",
});

export type TableProps = TableHTMLAttributes<HTMLTableElement> &
  TableStyleProps & {
    bordered?: boolean;
    striped?: boolean;
    hoverable?: boolean;
    compact?: boolean;
    stickyHeader?: boolean;
  };

export default function Table({
  className,
  variant,
  size,
  bordered = false,
  striped = false,
  hoverable = false,
  compact = false,
  stickyHeader = false,
  ...props
}: TableProps) {
  return (
    <TableContext.Provider
      value={{ bordered, striped, hoverable, compact, stickyHeader, size }}
    >
      <table
        className={twMerge(
          tableStyles({ variant, size }),
          bordered && "border-[3px] border-border",
          className,
        )}
        {...props}
      />
    </TableContext.Provider>
  );
}

export type TableResponsiveProps = HTMLAttributes<HTMLDivElement> & {
  rounded?: boolean;
  shadow?: boolean;
  animate?: AnimationTrigger;
  wrapperClassName?: string;
  faceClassName?: string;
};

export function TableResponsive({
  className,
  rounded = false,
  shadow = true,
  animate = false,
  wrapperClassName,
  faceClassName,
  children,
  ...props
}: TableResponsiveProps) {
  const { ref, shouldAnimate } =
    useAnimationTrigger<HTMLDivElement>(animate);

  return (
    <div
      ref={ref}
      className={twMerge(
        "brutal-table-wrapper group/table-wrapper relative isolate w-full",
        shadow && "shadow-[var(--shadow)]",
        rounded && "rounded-[var(--radius)]",
        shouldAnimate && "animate-brutal-pop",
        wrapperClassName,
      )}
      data-pop-direction="out"
    >
      <div
        tabIndex={0}
        role="region"
        aria-label="Scrollable table"
        className={twMerge(
          "relative w-full overflow-x-auto border-[3px]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "focus-visible:ring-offset-2",
          shouldAnimate ? "border-none brutal-pop-face" : "border-border",
          rounded && "rounded-[var(--radius)]",
          faceClassName,
          className,
        )}
        {...props}
      >
        {shouldAnimate && (
          <DrawBorder
            animate
            radius={rounded ? "var(--radius)" : undefined}
            className="z-10"
          />
        )}
        {children}
      </div>
    </div>
  );
}

export function TableHeader({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  const { stickyHeader } = useContext(TableContext);
  return (
    <thead
      className={twMerge(
        "bg-[var(--table-head)] text-[var(--table-head-fg)]",
        stickyHeader && "sticky top-0 z-20",
        className,
      )}
      {...props}
    />
  );
}

export function TableBody({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  const { striped } = useContext(TableContext);
  return (
    <tbody
      className={twMerge(
        striped && "[&_tr:nth-child(even)]:bg-[var(--table-stripe)]",
        className,
      )}
      {...props}
    />
  );
}

export function TableFooter({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tfoot
      className={twMerge(
        "border-t-[3px] border-border bg-secondary-background font-bold",
        className,
      )}
      {...props}
    />
  );
}

export function TableRow({
  className,
  ...props
}: HTMLAttributes<HTMLTableRowElement>) {
  const { hoverable } = useContext(TableContext);
  return (
    <tr
      className={twMerge(
        "border-b-[3px] border-border last:border-b-0",
        "transition-colors duration-150 motion-reduce:transition-none",
        hoverable && "hover:bg-main/20",
        className,
      )}
      {...props}
    />
  );
}

function cellPadding(size: TableOptions["size"], compact: boolean) {
  if (compact) return "px-2 py-1.5";
  if (size === "sm") return "px-3 py-2";
  if (size === "lg") return "px-5 py-4";
  return "px-4 py-3";
}

export function TableHead({
  className,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) {
  const { bordered, compact, size } = useContext(TableContext);
  return (
    <th
      className={twMerge(
        "text-left font-bold uppercase tracking-wide",
          bordered && "border-[3px] border-border",
        cellPadding(size, compact),
        className,
      )}
      {...props}
    />
  );
}

export function TableCell({
  className,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) {
  const { bordered, compact, size } = useContext(TableContext);
  return (
    <td
      className={twMerge(
        bordered && "border-[3px] border-border",
        cellPadding(size, compact),
        className,
      )}
      {...props}
    />
  );
}

export function TableCaption({
  className,
  ...props
}: HTMLAttributes<HTMLTableCaptionElement>) {
  return (
    <caption
      className={twMerge(
        "caption-bottom px-4 py-3 text-left text-sm text-foreground/70",
        className,
      )}
      {...props}
    />
  );
}
