import type { HTMLAttributes, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import DrawBorder from "../utils/draw-border";
import { NavCollapseProvider } from "./nav";
import {
  useAnimationTrigger,
  type AnimationTrigger,
} from "../utils/use-enter-viewport";

// Sidebar styles
const sidebarStyles = cva(
  [
    // Layout and stacking. The face does not scroll, so a flyout can leave the rail.
    "relative z-10 isolate flex h-full min-h-0 w-full flex-col overflow-visible",

    // Border and typography
    "border-[3px] font-mono font-bold",

    // Disabled state and reduced motion. Gray communicates that it cannot be used.
    "aria-disabled:pointer-events-none aria-disabled:bg-disabled aria-disabled:text-disabled-foreground",
    "transition-[width] duration-300 ease-out",
    "motion-reduce:transition-none",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          // Fill and ink
          "bg-main text-main-foreground",

          // Surface for outline children. A main parent slides the outline button in secondary.
          "[--surface:var(--main)] [--surface-foreground:var(--main-foreground)] [--outline-button-fill:var(--chart-2)]",
        ].join(" "),
        secondary: [
          // Fill and ink
          "bg-chart-2 text-main-foreground",

          // Surface for outline children. Hover slide stays main.
          "[--surface:var(--chart-2)] [--surface-foreground:var(--main-foreground)] [--outline-button-fill:var(--main)]",
        ].join(" "),
        outline: [
          // Cut out of the parent surface and ink.
          "bg-[var(--surface)] text-[var(--surface-foreground)]",
        ].join(" "),
      },
      // Padding and type size
      size: {
        sm: "p-3 text-xs",
        md: "p-5 text-sm",
        lg: "p-8 text-base",
      },
      // Icon rail. Labels hide through NavCollapseProvider.
      collapsed: {
        true: "w-20 items-center",
        false: "w-full",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "md",
      collapsed: false,
    },
  },
);

// Sidebar props
export type SidebarProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof sidebarStyles> & {
    collapsed?: boolean;
    offcanvas?: boolean;
    open?: boolean;
    onClose?: () => void;
    animate?: AnimationTrigger;
    rounded?: boolean;
    shadow?: boolean;
    border?: boolean;
    disabled?: boolean;
    wrapperClassName?: string;
    faceClassName?: string;
    children?: ReactNode;
  };

// Main Sidebar component
export default function Sidebar({
  children,
  className,
  variant,
  size,
  collapsed = false,
  offcanvas = false,
  open = false,
  onClose,
  animate = false,
  rounded = false,
  shadow = true,
  border = true,
  disabled = false,
  wrapperClassName: wrapperClassNameProp,
  faceClassName,
  ...props
}: SidebarProps) {
  const face = (
    <SidebarFace
      className={className}
      variant={variant}
      size={size}
      collapsed={collapsed}
      animate={animate}
      rounded={rounded}
      shadow={shadow}
      border={border}
      disabled={disabled}
      wrapperClassName={wrapperClassNameProp}
      faceClassName={faceClassName}
      {...props}
    >
      <NavCollapseProvider collapsed={collapsed}>
        {children}
      </NavCollapseProvider>
    </SidebarFace>
  );

  if (!offcanvas) return face;

  return (
    <Offcanvas
      open={open}
      onClose={onClose}
      variant={variant}
      size={size}
      rounded={rounded}
      shadow={shadow}
      border={border}
    >
      <NavCollapseProvider collapsed={false}>{children}</NavCollapseProvider>
    </Offcanvas>
  );
}

type SidebarFaceProps = SidebarProps;

function SidebarFace({
  children,
  className,
  variant,
  size,
  collapsed = false,
  animate = false,
  rounded = false,
  shadow = true,
  border = true,
  disabled = false,
  wrapperClassName: wrapperClassNameProp,
  faceClassName,
  ...props
}: SidebarFaceProps) {
  // Animation trigger
  const { ref, shouldAnimate } = useAnimationTrigger<HTMLDivElement>(animate);
  const showShadow = shadow || Boolean(animate);

  // Wrapper classes
  const wrapperClassName = twMerge(
    [
      // Layout and stacking. A collapsed rail sits above the page so its flyout shows.
      "relative isolate flex h-full max-h-dvh",
      collapsed && "z-50",

      // Width eases between the icon rail and the full column.
      "transition-[width] duration-300 ease-out",
      collapsed ? "w-20" : "w-full",

      // Shadow. A pop needs the offset, so animation turns it on.
      showShadow && "shadow-[var(--shadow)]",
      rounded && "rounded-[var(--radius)]",

      // Animation
      shouldAnimate && "animate-brutal-pop",
    ]
      .filter(Boolean)
      .join(" "),
    wrapperClassNameProp,
  );

  return (
    <div ref={ref} className={wrapperClassName} data-pop-direction="out">
      <aside
        className={twMerge(
          [
            sidebarStyles({ variant, size, collapsed }),

            // Resting stroke, or none while the SVG draws it. border false drops both.
            !border
              ? "border-none"
              : shouldAnimate
                ? "border-transparent"
                : "border-border",

            // Pop target. Must be the wrapper's direct child.
            shouldAnimate && "brutal-pop-face",
            rounded && "rounded-[var(--radius)]",
            faceClassName,
            className,
          ]
            .filter(Boolean)
            .join(" "),
        )}
        aria-disabled={disabled || undefined}
        {...props}
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
          className={twMerge(
            [
              // Layout. Scrolls a long column. A collapsed rail stays visible so the flyout is not clipped.
              "flex min-h-0 w-full flex-1 flex-col gap-4",
              collapsed
                ? "items-center overflow-visible"
                : "overflow-x-hidden overflow-y-auto pe-3",
            ]
              .filter(Boolean)
              .join(" "),
          )}
        >
          {children}
        </div>
      </aside>
    </div>
  );
}

// Offcanvas props
export type OffcanvasProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof sidebarStyles> & {
    open?: boolean;
    onClose?: () => void;
    rounded?: boolean;
    shadow?: boolean;
    border?: boolean;
    children?: ReactNode;
  };

// Overlay panel. Shown or hidden, with no slide yet.
export function Offcanvas({
  open = false,
  onClose,
  className,
  variant,
  size,
  rounded = false,
  shadow = true,
  border = true,
  children,
  ...props
}: OffcanvasProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Close"
        onClick={onClose}
      />
      <aside
        className={twMerge(
          [
            sidebarStyles({ variant, size }),

            // Layout and stacking. Sits above the backdrop. The face itself does not scroll.
            "h-dvh max-h-dvh w-72",

            // Border and optional shadow
            border ? "border-border" : "border-none",
            shadow && "shadow-[var(--shadow)]",
            rounded && "rounded-[var(--radius)]",
            className,
          ]
            .filter(Boolean)
            .join(" "),
        )}
        {...props}
      >
        <div
          className={[
            // Scroll the panel. The flyout is not used while the panel is expanded.
            "flex min-h-0 w-full flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto pe-3",
          ].join(" ")}
        >
          {children}
        </div>
      </aside>
    </div>
  );
}
