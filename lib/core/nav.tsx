/* eslint-disable react-hooks/set-state-in-effect -- disclosure clipping and collapsed flyouts mirror controlled layout state */
/* eslint-disable react-refresh/only-export-components -- public nav contexts and hooks intentionally share the component module */
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
  type TransitionEvent,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { ChevronRight } from "lucide-react";
import { useDismissableLayer } from "../utils/use-dismissable-layer";

// True while a dropdown sits inside a nav item, so the menu skips its shadow.
const NavItemContext = createContext(false);

export function useInNavItem() {
  return useContext(NavItemContext);
}

// True while the parent sidebar is an icon rail.
const NavCollapseContext = createContext(false);

export function useNavCollapsed() {
  return useContext(NavCollapseContext);
}

export function NavCollapseProvider({
  collapsed,
  children,
}: {
  collapsed: boolean;
  children: ReactNode;
}) {
  return (
    <NavCollapseContext.Provider value={collapsed}>
      {children}
    </NavCollapseContext.Provider>
  );
}

// Keep the panel clipped while it collapses, then release it so a popped
// link or a dropdown can draw outside the row.
export function useRevealClip(open: boolean) {
  const [clip, setClip] = useState(!open);

  useEffect(() => {
    if (!open) {
      setClip(true);
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setClip(false);
    }
  }, [open]);

  function onTransitionEnd(event: TransitionEvent<HTMLElement>) {
    if (event.target !== event.currentTarget) return;
    if (event.propertyName !== "grid-template-rows") return;
    if (open) setClip(false);
  }

  return { clip, onTransitionEnd };
}

// Nav styles
const navStyles = cva(
  [
    // Layout
    "flex w-full list-none",

    // Reduced motion
    "motion-reduce:transition-none",
  ].join(" "),
  {
    variants: {
      // Stack links in a bar or down a sidebar.
      direction: {
        row: "flex-row flex-wrap items-center gap-2",
        column: "flex-col items-stretch gap-2",
      },
    },
    defaultVariants: {
      direction: "row",
    },
  },
);

// Nav props
export type NavProps = HTMLAttributes<HTMLUListElement> &
  VariantProps<typeof navStyles>;

// Main Nav component
export function Nav({ className, direction, ...props }: NavProps) {
  return (
    <ul className={twMerge(navStyles({ direction }), className)} {...props} />
  );
}

// Nav item props
export type NavItemProps = HTMLAttributes<HTMLLIElement> & {
  rounded?: boolean;
};

// Main NavItem component
export function NavItem({
  className,
  rounded = false,
  ...props
}: NavItemProps) {
  return (
    <NavItemContext.Provider value={true}>
      <li
        className={twMerge(
          "flex flex-col",
          rounded &&
            "rounded-[var(--radius)] [&>a]:rounded-[var(--radius)] [&>button]:rounded-[var(--radius)]",
          className,
        )}
        {...props}
      />
    </NavItemContext.Provider>
  );
}

// Nav link styles
const navLinkStyles = cva(
  [
    // Layout and stacking. The name scopes hover to this link.
    "group/nav relative z-10 isolate inline-flex w-full items-center gap-2",

    // Border and typography
    "border-[3px] border-border font-mono font-bold uppercase tracking-wide",

    // Pop. An active link lifts off the bar.
    "transition-[translate] duration-200 ease-out",

    // Keyboard focus
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-ring focus-visible:ring-offset-2",

    // Disabled state. Gray communicates that the link cannot be used.
    "aria-disabled:pointer-events-none aria-disabled:bg-disabled aria-disabled:text-disabled-foreground",

    // Reduced motion
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
        sm: "px-3 py-2 text-xs",
        md: "px-4 py-2.5 text-sm",
        lg: "px-5 py-3 text-base",
      },
      // Filled face for the current page.
      active: {
        true: "bg-main text-main-foreground",
        false: "",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "md",
      active: false,
    },
  },
);

// Hover and focus fill styles
const fillStyles = cva(
  [
    // Fill layer positioning
    "pointer-events-none absolute inset-0 origin-left",

    // Fill reveal on hover and keyboard focus
    "scale-x-0 transition-transform duration-300 ease-out",

    // Reduced motion
    "motion-reduce:transition-none",
  ].join(" "),
  {
    variants: {
      // Slide color. Outline reads the parent so a main parent uses secondary.
      variant: {
        primary: "bg-chart-2",
        secondary: "bg-main",
        outline: "bg-[var(--outline-button-fill)]",
      },
    },
    defaultVariants: {
      variant: "outline",
    },
  },
);

function hoverInk(
  variant: "primary" | "secondary" | "outline" | null | undefined,
) {
  // Primary slides in secondary, so the label follows the page ink.
  if (variant === "primary") {
    return "group-hover/nav:text-foreground group-focus-visible/nav:text-foreground";
  }

  // Outline and secondary slides are a filled color, so the label goes dark.
  return "group-hover/nav:text-main-foreground group-focus-visible/nav:text-main-foreground";
}

function HoverFill({
  variant,
  rounded,
}: {
  variant: "primary" | "secondary" | "outline" | null | undefined;
  rounded?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className={twMerge(
        [
          // Start at the inner edge so the fill never covers the 3px stroke.
          "pointer-events-none absolute inset-0 z-0 overflow-hidden",
          rounded && "rounded-[calc(var(--radius)-3px)]",
        ]
          .filter(Boolean)
          .join(" "),
      )}
    >
      <span
        className={twMerge(
          fillStyles({ variant }),
          "group-hover/nav:scale-x-100 group-focus-visible/nav:scale-x-100",
          rounded && "rounded-[calc(var(--radius)-3px)]",
        )}
      />
    </span>
  );
}

// Nav link props
export type NavLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof navLinkStyles> & {
    active?: boolean;
    disabled?: boolean;
    rounded?: boolean;
    icon?: ReactNode;
  };

// Main NavLink component
export function NavLink({
  href,
  active = false,
  disabled = false,
  rounded = false,
  icon,
  className,
  variant,
  size,
  children,
  ...props
}: NavLinkProps) {
  const collapsed = useNavCollapsed();
  const popped = active && !disabled;

  return (
    <a
      href={disabled ? undefined : href}
      aria-current={active ? "page" : undefined}
      aria-disabled={disabled || undefined}
      className={twMerge(
        [
          navLinkStyles({ variant, size, active }),

          // Icon rail keeps the mark and hides the words.
          collapsed ? "justify-center px-2" : "",

          // Lift the current page off the bar so its shadow shows.
          popped &&
            "z-20 shadow-[var(--shadow)] [translate:calc(var(--shadow-offset-x)*-1)_calc(var(--shadow-offset-y)*-1)]",
          rounded && "rounded-[var(--radius)]",
          className,
        ]
          .filter(Boolean)
          .join(" "),
      )}
      {...props}
    >
      <span
        className={twMerge(
          "relative z-10 inline-flex min-w-0 items-center",
          collapsed ? "gap-0" : "gap-2",
          hoverInk(variant),
        )}
      >
        {icon ? (
          <span aria-hidden="true" className="shrink-0">
            {icon}
          </span>
        ) : (
          collapsed && (
            <span aria-hidden="true" className="shrink-0">
              {typeof children === "string" ? children.slice(0, 1) : null}
            </span>
          )
        )}
        <span
          className={twMerge(
            [
              // Label width. Collapsed rails keep the icon and tuck the words away.
              "grid transition-[grid-template-columns] duration-300 ease-out",
              collapsed ? "grid-cols-[0fr]" : "grid-cols-[1fr]",
              "motion-reduce:transition-none",
            ]
              .filter(Boolean)
              .join(" "),
          )}
        >
          <span className="overflow-hidden whitespace-nowrap">{children}</span>
        </span>
      </span>
      {!disabled && <HoverFill variant={variant} rounded={rounded} />}
    </a>
  );
}

// Nav group props
export type NavGroupProps = HTMLAttributes<HTMLLIElement> &
  VariantProps<typeof navLinkStyles> & {
    label: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    defaultOpen?: boolean;
    rounded?: boolean;
    icon?: ReactNode;
  };

// Parent item that shows or hides its child links, the way a Bootstrap sidebar does.
export function NavGroup({
  label,
  open,
  onOpenChange,
  defaultOpen = false,
  rounded = false,
  icon,
  className,
  variant,
  size,
  children,
  ...props
}: NavGroupProps) {
  const collapsed = useNavCollapsed();
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const [collapsedOpen, setCollapsedOpen] = useState(false);
  const groupRef = useRef<HTMLLIElement>(null);
  const isOpen = open ?? uncontrolled;
  const revealed = collapsed ? collapsedOpen : isOpen;
  const { clip, onTransitionEnd } = useRevealClip(revealed);

  useEffect(() => {
    setCollapsedOpen(false);
  }, [collapsed]);

  useDismissableLayer({
    ref: groupRef,
    enabled: collapsed && collapsedOpen,
    onDismiss: () => setCollapsedOpen(false),
  });

  function toggle() {
    if (collapsed) {
      setCollapsedOpen((value) => !value);
      return;
    }

    const next = !isOpen;
    onOpenChange?.(next);
    if (open === undefined) setUncontrolled(next);
  }

  return (
    <li
      ref={groupRef}
      className={twMerge(
        "relative flex flex-col",
        collapsed && "z-50",
        className,
      )}
      {...props}
    >
      <button
        type="button"
        className={twMerge(
          navLinkStyles({ variant, size }),
          "text-left",
          collapsed && "justify-center px-2",
          rounded && "rounded-[var(--radius)]",
        )}
        aria-expanded={revealed}
        onClick={toggle}
      >
        <span
          className={twMerge(
            "relative z-10 inline-flex w-full min-w-0 items-center",
            collapsed ? "justify-center gap-0" : "gap-2",
            hoverInk(variant),
          )}
        >
          {icon ? (
            <span aria-hidden="true" className="shrink-0">
              {icon}
            </span>
          ) : (
            collapsed && (
              <span aria-hidden="true" className="shrink-0">
                {label.slice(0, 1)}
              </span>
            )
          )}
          <span
            className={twMerge(
              [
                // Label width. The rail keeps the icon.
                "grid transition-[grid-template-columns] duration-300 ease-out",
                collapsed ? "grid-cols-[0fr]" : "grid-cols-[1fr]",
                "motion-reduce:transition-none",
              ]
                .filter(Boolean)
                .join(" "),
            )}
          >
            <span className="overflow-hidden whitespace-nowrap">{label}</span>
          </span>
          <ChevronRight
            aria-hidden="true"
            className={twMerge(
              [
                // Caret. Hidden on the icon rail.
                "size-4 shrink-0",
                collapsed && "hidden",

                // Turn down while the group is open.
                "transition-transform duration-200 ease-out",
                revealed && "rotate-90",

                // Reduced motion
                "motion-reduce:transition-none",
              ]
                .filter(Boolean)
                .join(" "),
            )}
          />
        </span>
        <HoverFill variant={variant} rounded={rounded} />
      </button>
      {collapsed && collapsedOpen ? (
        <div
          className={twMerge(
            [
              // Flyout chooser for an icon rail.
              "absolute left-full top-0 z-50 ml-3 min-w-48",
              "border-[3px] border-border bg-[var(--surface)] p-2 text-[var(--surface-foreground)]",
              "shadow-[var(--shadow)]",

              // Mount only after it was explicitly opened.
              "origin-left",
            ]
              .filter(Boolean)
              .join(" "),
          )}
        >
          <p className="px-3 py-2 font-mono text-xs font-bold uppercase tracking-wide">
            {label}
          </p>
          <NavCollapseProvider collapsed={false}>
            <ul
              className="flex list-none flex-col gap-2"
              onClick={() => setCollapsedOpen(false)}
            >
              {children}
            </ul>
          </NavCollapseProvider>
        </div>
      ) : !collapsed ? (
        <div
          className={twMerge(
            [
              // Height. Closed rows take no space.
              "grid transition-[grid-template-rows] duration-300 ease-out",
              revealed ? "grid-rows-[1fr]" : "grid-rows-[0fr]",

              // Reduced motion
              "motion-reduce:transition-none",
            ]
              .filter(Boolean)
              .join(" "),
          )}
          onTransitionEnd={onTransitionEnd}
        >
          <div
            inert={!revealed ? true : undefined}
            className={twMerge(
              "min-h-0",
              clip ? "overflow-hidden" : "overflow-visible",
            )}
          >
            <ul className="flex list-none flex-col gap-2 py-2 pe-2 ps-4">
              {children}
            </ul>
          </div>
        </div>
      ) : null}
    </li>
  );
}
