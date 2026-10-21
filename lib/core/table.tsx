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
import { SurfaceProvider, useSurfaceAnimate, useSurfaceFlag } from "../utils/surface";
import {
  useAnimationTrigger,
  type AnimationTrigger,
} from "../utils/use-enter-viewport";

const tableStyles = cva(
  [
    // Layout and typography. The frame, not this element, draws the outer stroke.
    "w-full border-collapse font-mono text-foreground",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "[--table-head:var(--main)] [--table-head-fg:var(--main-foreground)] [--table-stripe:color-mix(in_oklch,var(--foreground)_12%,var(--secondary-background))]",
        secondary:
          "[--table-head:var(--chart-2)] [--table-head-fg:var(--main-foreground)] [--table-stripe:color-mix(in_oklch,var(--foreground)_12%,var(--secondary-background))]",
        outline:
          "[--table-head:var(--surface)] [--table-head-fg:var(--surface-foreground)] [--table-stripe:color-mix(in_oklch,var(--foreground)_12%,var(--secondary-background))]",
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
  },
);

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

type CellSurfaceProps = {
  border?: boolean;
  rounded?: boolean;
  shadow?: boolean;
  animate?: AnimationTrigger;
};

export type TableProps = TableHTMLAttributes<HTMLTableElement> &
  TableStyleProps &
  CellSurfaceProps & {
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
  border,
  rounded,
  shadow,
  animate,
  children,
  ...props
}: TableProps) {
  const grid = border ?? bordered;

  return (
    <TableContext.Provider
      value={{ bordered: grid, striped, hoverable, compact, stickyHeader, size }}
    >
      <SurfaceProvider
        border={border}
        rounded={rounded}
        shadow={shadow}
        animate={animate}
      >
        <table
          data-bordered={grid ? "" : undefined}
          className={twMerge(
            [tableStyles({ variant, size }), className]
              .filter(Boolean)
              .join(" "),
          )}
          {...props}
        >
          {children}
        </table>
      </SurfaceProvider>
    </TableContext.Provider>
  );
}

export type TableResponsiveProps = HTMLAttributes<HTMLDivElement> & {
  rounded?: boolean;
  shadow?: boolean;
  border?: boolean;
  animate?: AnimationTrigger;
  disabled?: boolean;
  wrapperClassName?: string;
  faceClassName?: string;
};

export function TableResponsive({
  className,
  rounded: roundedProp,
  shadow: shadowProp,
  border: borderProp,
  animate: animateProp,
  disabled = false,
  wrapperClassName,
  faceClassName,
  children,
  ...props
}: TableResponsiveProps) {
  const rounded = useSurfaceFlag(roundedProp, "rounded", false);
  const shadow = useSurfaceFlag(shadowProp, "shadow", true);
  const border = useSurfaceFlag(borderProp, "border", true);
  const animate = useSurfaceAnimate(animateProp);
  const { ref, shouldAnimate } = useAnimationTrigger<HTMLDivElement>(animate);
  const showShadow = shadow || Boolean(animate);

  return (
    <div
      ref={ref}
      className={twMerge(
        [
          // Layout and stacking. No overflow, so the shadow is not a scrollport.
          "brutal-table-wrapper group/table-wrapper relative isolate w-full",

          // Shadow
          showShadow && "shadow-[var(--shadow)]",
          disabled && "pointer-events-none opacity-70",
          rounded && "rounded-[var(--radius)]",

          // Animation
          shouldAnimate && "animate-brutal-pop",
        ]
          .filter(Boolean)
          .join(" "),
        wrapperClassName,
      )}
      data-pop-direction="out"
    >
      <div
        className={twMerge(
          [
            // Layout and border. The stroke stays on this face.
            // A bordered table already draws that grid, so the frame does not add a second stroke.
            "relative w-full border-[3px]",
            "has-[table[data-bordered]]:!border-0",

            // Resting stroke, or none while the SVG draws it. border false drops both.
            !border
              ? "border-none"
              : shouldAnimate
                ? "border-transparent"
                : "border-border",

            // Pop target. Must be the wrapper's direct child.
            shouldAnimate && "brutal-pop-face",
            rounded && "rounded-[var(--radius)]",
            rounded && !shouldAnimate && "overflow-hidden",
            faceClassName,
          ]
            .filter(Boolean)
            .join(" "),
        )}
      >
        {/* Border */}
        {shouldAnimate && border && (
          <DrawBorder
            animate
            radius={rounded ? "var(--radius)" : undefined}
            className="z-10"
          />
        )}
        <div
          tabIndex={0}
          role="region"
          aria-label="Scrollable table"
          className={twMerge(
            [
              // Scroll. Horizontal only, and only when the table is wider than the frame.
              "w-full overflow-x-auto overflow-y-hidden",

              // Keyboard focus
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "focus-visible:ring-offset-2",
              className,
            ]
              .filter(Boolean)
              .join(" "),
          )}
          {...props}
        >
          <SurfaceProvider
            shadow={showShadow}
            border={border}
            rounded={rounded}
            animate={animate}
          >
            {children}
          </SurfaceProvider>
        </div>
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
        [
          // Fill and stacking
          "bg-[var(--table-head)] text-[var(--table-head-fg)]",
          stickyHeader && "sticky top-0 z-20",
          className,
        ]
          .filter(Boolean)
          .join(" "),
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
        [
          // Odd rows stay on the secondary surface. Even rows take a darker mix.
          "bg-secondary-background",
          striped && "[&_tr:nth-child(even)>*]:bg-[var(--table-stripe)]",
          className,
        ]
          .filter(Boolean)
          .join(" "),
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
        [
          // Fill and type. Row rules already close the body above this.
          "bg-secondary-background font-bold",
          className,
        ]
          .filter(Boolean)
          .join(" "),
      )}
      {...props}
    />
  );
}

export function TableRow({
  className,
  border,
  rounded,
  shadow,
  ...props
}: HTMLAttributes<HTMLTableRowElement> & CellSurfaceProps) {
  const { bordered, hoverable } = useContext(TableContext);
  const showRule = border ?? !bordered;
  return (
    <tr
      className={twMerge(
        [
          // Every row keeps a bottom rule, including the last, unless a cell grid replaces it.
          showRule && "border-b-[3px] border-border",
          rounded && "rounded-[var(--radius)]",
          shadow && "shadow-[var(--shadow)]",

          // Interaction and reduced motion
          "transition-colors duration-150 motion-reduce:transition-none",
          hoverable && "hover:bg-main/20",
          className,
        ]
          .filter(Boolean)
          .join(" "),
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
  border,
  rounded,
  shadow,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement> & CellSurfaceProps) {
  const { bordered, compact, size } = useContext(TableContext);
  const showBorder = border ?? bordered;
  return (
    <th
      className={twMerge(
        [
          // Typography
          "text-left font-bold uppercase tracking-wide",

          // Full grid. Collapse shares each edge, so every row and column is ruled.
          showBorder && "border-[3px] border-border",
          rounded && "rounded-[var(--radius)]",
          shadow && "shadow-[var(--shadow)]",
          cellPadding(size, compact),
          className,
        ]
          .filter(Boolean)
          .join(" "),
      )}
      {...props}
    />
  );
}

export function TableCell({
  className,
  border,
  rounded,
  shadow,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement> & CellSurfaceProps) {
  const { bordered, compact, size } = useContext(TableContext);
  const showBorder = border ?? bordered;
  return (
    <td
      className={twMerge(
        [
          // Full grid. Collapse shares each edge, so every row and column is ruled.
          showBorder && "border-[3px] border-border",
          rounded && "rounded-[var(--radius)]",
          shadow && "shadow-[var(--shadow)]",
          cellPadding(size, compact),
          className,
        ]
          .filter(Boolean)
          .join(" "),
      )}
      {...props}
    />
  );
}

export function TableCaption({
  className,
  border,
  rounded,
  shadow,
  ...props
}: HTMLAttributes<HTMLTableCaptionElement> & CellSurfaceProps) {
  const { bordered } = useContext(TableContext);
  const showBorder = border ?? bordered;
  return (
    <caption
      className={twMerge(
        [
          // Layout and typography. Side and bottom rules continue the cell grid.
          // The row above already supplies the top rule.
          "caption-bottom bg-secondary-background px-4 py-3 text-left text-sm text-foreground",
          showBorder && "border-x-[3px] border-b-[3px] border-border",
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
