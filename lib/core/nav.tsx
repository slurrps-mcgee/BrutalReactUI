/* eslint-disable react-hooks/set-state-in-effect -- disclosure clipping and collapsed flyouts mirror controlled layout state */
/* eslint-disable react-refresh/only-export-components -- public nav contexts and hooks intentionally share the component module */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
  type TransitionEvent,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { ChevronRight } from "lucide-react";
import DrawBorder from "../utils/draw-border";
import {
  SurfaceProvider,
  borderPaintClass,
  faceRadiusClass,
  useSurface,
  useSurfaceAnimate,
  useSurfaceFlag,
} from "../utils/surface";
import { useDismissableLayer } from "../utils/use-dismissable-layer";
import {
  useAnimationTrigger,
  type AnimationTrigger,
} from "../utils/use-enter-viewport";

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
        column: "w-full flex-col items-stretch gap-2 [&>li]:w-full",
      },
    },
    defaultVariants: {
      direction: "row",
    },
  },
);

// Nav link styles
const navLinkStyles = cva(
  [
    // Layout and stacking. The name scopes hover to this link.
    "group/nav relative z-10 isolate inline-flex w-full items-center gap-2",

    // Border and typography
    "border-border font-mono font-bold uppercase tracking-wide",

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

// True while a dropdown sits inside a nav item, so the menu skips its shadow.
const NavItemContext = createContext(false);

// Below the large breakpoint, an open navbar collapse stacks its links.
const NavbarMenuContext = createContext(false);

// True while the parent sidebar is an icon rail.
const NavCollapseContext = createContext(false);

function useNavbarMenuStacked() {
  return useContext(NavbarMenuContext);
}

export function useNavAnimate(): AnimationTrigger | undefined {
  return useSurface().animate;
}

export function useInNavItem() {
  return useContext(NavItemContext);
}

export function useNavCollapsed() {
  return useContext(NavCollapseContext);
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
  fillClassName,
}: {
  variant: "primary" | "secondary" | "outline" | null | undefined;
  rounded?: boolean;
  fillClassName?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={twMerge(
        [
          // Start at the inner edge so the fill never covers the 3px stroke.
          "pointer-events-none absolute inset-0 z-0 overflow-hidden",
          rounded && "rounded-[max(0px,calc(var(--radius)-var(--border-width)))]",
        ]
          .filter(Boolean)
          .join(" "),
      )}
    >
      <span
        className={twMerge(
          fillStyles({ variant }),
          "group-hover/nav:scale-x-100 group-focus-visible/nav:scale-x-100",
          fillClassName,
          rounded && "rounded-[max(0px,calc(var(--radius)-var(--border-width)))]",
        )}
      />
    </span>
  );
}

// Nav props
export type NavProps = HTMLAttributes<HTMLUListElement> &
  VariantProps<typeof navStyles>;

// Main Nav component
export function Nav({ className, direction, ...props }: NavProps) {
  const stacked = useNavbarMenuStacked();

  return (
    <ul
      className={twMerge(
        navStyles({ direction: stacked ? "column" : direction }),
        className,
      )}
      {...props}
    />
  );
}

// Nav item props
export type NavItemProps = HTMLAttributes<HTMLLIElement> & {
  rounded?: boolean;
  shadow?: boolean;
  border?: boolean;
  animate?: AnimationTrigger;
};

// Nav link props
export type NavLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof navLinkStyles> & {
    active?: boolean;
    disabled?: boolean;
    rounded?: boolean;
    shadow?: boolean;
    border?: boolean;
    icon?: ReactNode;
    animate?: AnimationTrigger;
    wrapperClassName?: string;
    faceClassName?: string;
    fillClassName?: string;
  };

// Nav group props
export type NavGroupProps = HTMLAttributes<HTMLLIElement> &
  VariantProps<typeof navLinkStyles> & {
    label: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    defaultOpen?: boolean;
    rounded?: boolean;
    shadow?: boolean;
    border?: boolean;
    icon?: ReactNode;
    animate?: AnimationTrigger;
  };

export function NavbarMenuProvider({
  stacked,
  children,
}: {
  stacked: boolean;
  children: ReactNode;
}) {
  return (
    <NavbarMenuContext.Provider value={stacked}>
      {children}
    </NavbarMenuContext.Provider>
  );
}

// Navbar and NavItem share one value. A set prop replaces the parent, including false.
export function NavAnimateProvider({
  animate,
  children,
}: {
  animate?: AnimationTrigger;
  children: ReactNode;
}) {
  return <SurfaceProvider animate={animate}>{children}</SurfaceProvider>;
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

// Main NavItem component
export function NavItem({
  className,
  rounded,
  shadow,
  border,
  animate,
  ...props
}: NavItemProps) {
  const stacked = useNavbarMenuStacked();
  const isRounded = useSurfaceFlag(rounded, "rounded", false);

  return (
    <NavItemContext.Provider value={true}>
      <SurfaceProvider
        rounded={rounded}
        shadow={shadow}
        border={border}
        animate={animate}
      >
        <li
          className={twMerge(
            "flex flex-col",
            stacked && "w-full [&>*]:w-full",
            isRounded &&
              "rounded-[var(--radius)] [&>span]:rounded-[var(--radius)] [&_a]:rounded-[var(--radius)] [&>button]:rounded-[var(--radius)]",
            className,
          )}
          {...props}
        />
      </SurfaceProvider>
    </NavItemContext.Provider>
  );
}

// Main NavLink component
export function NavLink({
  href,
  active = false,
  disabled = false,
  rounded: roundedProp,
  shadow: shadowProp,
  border: borderProp,
  icon,
  animate: animateProp,
  className,
  variant,
  size,
  wrapperClassName,
  faceClassName,
  fillClassName,
  children,
  ...props
}: NavLinkProps) {
  const collapsed = useNavCollapsed();
  const isRounded = useSurfaceFlag(roundedProp, "rounded", false);
  const shadow = useSurfaceFlag(shadowProp, "shadow", true);
  const border = useSurfaceFlag(borderProp, "border", true);
  const animate = useSurfaceAnimate(animateProp);
  const pop = active && !disabled && shadow;
  const { ref, shouldAnimate } = useAnimationTrigger<HTMLSpanElement>(animate);

  return (
    <span
      ref={ref}
      data-pop-direction={shouldAnimate && pop ? "out" : undefined}
      className={twMerge(
        [
          // Layout. The shadow stays on this box so the active face can pop out of it.
          "relative isolate flex w-full",
          pop && "z-20 shadow-[var(--shadow)]",
          shouldAnimate && pop && "animate-brutal-pop",
          isRounded && "rounded-[var(--radius)]",
          wrapperClassName,
        ]
          .filter(Boolean)
          .join(" "),
      )}
    >
      <a
        href={disabled ? undefined : href}
        aria-current={active ? "page" : undefined}
        aria-disabled={disabled || undefined}
        className={twMerge(
          [
            navLinkStyles({ variant, size, active }),

            // Icon rail keeps the mark and hides the words.
            collapsed ? "justify-center px-2" : "",
            shouldAnimate && border ? "border-none" : borderPaintClass(border),
            shouldAnimate && pop && "brutal-pop-face",
            faceRadiusClass(isRounded),
            faceClassName,
            className,
          ]
            .filter(Boolean)
            .join(" "),
        )}
        {...props}
      >
        {shouldAnimate && border && (
          <DrawBorder
            animate
            radius={isRounded ? "var(--radius)" : undefined}
            className="z-10"
          />
        )}
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
            <span className="overflow-hidden whitespace-nowrap">
              {children}
            </span>
          </span>
        </span>
        {!disabled && (
          <HoverFill
            variant={variant}
            rounded={isRounded}
            fillClassName={fillClassName}
          />
        )}
      </a>
    </span>
  );
}

// Parent item that shows or hides its child links, the way a Bootstrap sidebar does.
export function NavGroup({
  label,
  open,
  onOpenChange,
  defaultOpen = false,
  rounded: roundedProp,
  shadow: shadowProp,
  border: borderProp,
  icon,
  animate: animateProp,
  className,
  variant,
  size,
  children,
  ...props
}: NavGroupProps) {
  const collapsed = useNavCollapsed();
  const rounded = useSurfaceFlag(roundedProp, "rounded", false);
  const shadow = useSurfaceFlag(shadowProp, "shadow", true);
  const border = useSurfaceFlag(borderProp, "border", true);
  const animate = useSurfaceAnimate(animateProp);
  const { ref, shouldAnimate } = useAnimationTrigger<HTMLSpanElement>(animate);
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
      <span
        ref={ref}
        data-pop-direction={shouldAnimate ? "out" : undefined}
        className={twMerge(
          "relative flex w-full",
          rounded && "rounded-[var(--radius)]",
          shouldAnimate && shadow && "shadow-[var(--shadow)]",
          shouldAnimate && "animate-brutal-pop",
        )}
      >
        <button
          type="button"
          className={twMerge(
            navLinkStyles({ variant, size }),
            "text-left",
            collapsed && "justify-center px-2",
            shouldAnimate && border ? "border-none" : borderPaintClass(border),
            shouldAnimate && "brutal-pop-face",
            faceRadiusClass(rounded),
          )}
          aria-expanded={revealed}
          onClick={toggle}
        >
          {shouldAnimate && border && (
            <DrawBorder
              animate
              radius={rounded ? "var(--radius)" : undefined}
              className="z-10"
            />
          )}
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
      </span>
      {collapsed && collapsedOpen ? (
        <div
          className={twMerge(
            [
              // Flyout chooser for an icon rail.
              "absolute left-full top-0 z-50 ml-3 min-w-48",
              "border-[length:var(--border-width)] bg-[var(--surface)] p-2 text-[var(--surface-foreground)]",
              border ? "border-border" : "border-none",
              shadow && "shadow-[var(--shadow)]",
              rounded && "rounded-[var(--radius)]",

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
            <SurfaceProvider
              rounded={roundedProp}
              shadow={shadowProp}
              border={borderProp}
              animate={animateProp}
            >
              <ul
                className="flex list-none flex-col gap-2"
                onClick={() => setCollapsedOpen(false)}
              >
                {children}
              </ul>
            </SurfaceProvider>
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
            <SurfaceProvider
              rounded={roundedProp}
              shadow={shadowProp}
              border={borderProp}
              animate={animateProp}
            >
              <ul className="flex list-none flex-col gap-2 py-2 pe-2 ps-4">
                {children}
              </ul>
            </SurfaceProvider>
          </div>
        </div>
      ) : null}
    </li>
  );
}
