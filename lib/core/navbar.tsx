/* eslint-disable react-refresh/only-export-components -- the public navbar context hook ships with its components */
import type { HTMLAttributes, ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import DrawBorder from "../utils/draw-border";
import { useRevealClip } from "./nav";
import {
  useAnimationTrigger,
  type AnimationTrigger,
} from "../utils/use-enter-viewport";

function useBelowLg() {
  const [below, setBelow] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 1023px)");
    const update = () => setBelow(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return below;
}

// True while a toggler sits in a navbar, so it hides once the bar is expanded.
const NavbarContext = createContext(false);

export function useInNavbar() {
  return useContext(NavbarContext);
}

// Navbar styles
const navbarStyles = cva(
  [
    // Layout and stacking
    "relative z-10 isolate flex w-full flex-wrap items-center justify-between gap-3",

    // Border and typography
    "border-[3px] font-mono font-bold",

    // Disabled state and reduced motion. Gray communicates that it cannot be used.
    "aria-disabled:pointer-events-none aria-disabled:bg-disabled aria-disabled:text-disabled-foreground",
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
        sm: "p-2 text-xs",
        md: "p-3 text-sm",
        lg: "p-4 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

// Navbar props
export type NavbarProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof navbarStyles> & {
    animate?: AnimationTrigger;
    rounded?: boolean;
    shadow?: boolean;
    disabled?: boolean;
    wrapperClassName?: string;
    faceClassName?: string;
    children?: ReactNode;
  };

// Main Navbar component
export default function Navbar({
  children,
  className,
  variant,
  size,
  animate = false,
  rounded = false,
  shadow = true,
  disabled = false,
  wrapperClassName: wrapperClassNameProp,
  faceClassName,
  ...props
}: NavbarProps) {
  // Animation trigger
  const { ref, shouldAnimate } = useAnimationTrigger<HTMLDivElement>(animate);

  // Wrapper classes
  const wrapperClassName = twMerge(
    [
      // Layout and stacking
      "relative isolate flex w-full",

      // Shadow. Optional so a bar can sit flat.
      shadow && "shadow-[var(--shadow)]",
      rounded && "rounded-[var(--radius)]",

      // Animation
      shouldAnimate && "animate-brutal-pop",
    ]
      .filter(Boolean)
      .join(" "),
    wrapperClassNameProp,
  );

  // Main return
  return (
    <div ref={ref} className={wrapperClassName} data-pop-direction="out">
      <nav
        className={twMerge(
          [
            navbarStyles({ variant, size }),

            // Resting stroke, or none while the SVG draws it.
            shouldAnimate ? "border-none" : "border-border",

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
        {shouldAnimate && (
          <DrawBorder
            animate
            radius={rounded ? "var(--radius)" : undefined}
            className="z-10"
          />
        )}
        <NavbarContext.Provider value={true}>{children}</NavbarContext.Provider>
      </nav>
    </div>
  );
}

// Brand props
export type NavbarBrandProps = HTMLAttributes<HTMLElement> & {
  href?: string;
};

// Main NavbarBrand component
export function NavbarBrand({
  href,
  className,
  children,
  ...props
}: NavbarBrandProps) {
  const brandClassName = twMerge(
    [
      // Layout and typography
      "relative z-10 font-display text-xl font-bold",
    ].join(" "),
    className,
  );

  if (href) {
    return (
      <a href={href} className={brandClassName} {...props}>
        {children}
      </a>
    );
  }

  return (
    <span className={brandClassName} {...props}>
      {children}
    </span>
  );
}

// Collapse props
export type NavbarCollapseProps = HTMLAttributes<HTMLDivElement> & {
  open?: boolean;
};

// Hidden below lg until the toggler opens it. Always shown from lg up.
export function NavbarCollapse({
  open = false,
  className,
  children,
  ...props
}: NavbarCollapseProps) {
  const { clip, onTransitionEnd } = useRevealClip(open);
  const belowLg = useBelowLg();

  return (
    <div
      className={twMerge(
        [
          // Height. Closed rows take no space below lg.
          "relative z-10 grid w-full transition-[grid-template-rows] duration-300 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          "lg:w-auto lg:grid-rows-[1fr]",

          // Reduced motion
          "motion-reduce:transition-none",
        ].join(" "),
        className,
      )}
      onTransitionEnd={onTransitionEnd}
      {...props}
    >
      <div
        inert={belowLg && !open ? true : undefined}
        className={twMerge(
          [
            // Clip while the row is moving, then release so a menu can pop out.
            "flex min-h-0 w-full flex-col gap-3",
            clip ? "overflow-hidden" : "overflow-visible",
            "lg:w-auto lg:flex-row lg:items-center lg:overflow-visible",
          ]
            .filter(Boolean)
            .join(" "),
        )}
      >
        {children}
      </div>
    </div>
  );
}
