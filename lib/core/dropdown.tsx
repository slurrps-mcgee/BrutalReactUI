/* eslint-disable react-hooks/set-state-in-effect -- menu presence coordinates staged enter and exit animation state */
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
  type TransitionEvent,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { ChevronUp } from "lucide-react";
import DrawBorder from "../utils/draw-border";
import {
  SurfaceProvider,
  borderPaintClass,
  faceRadiusClass,
  useSurfaceAnimate,
  useSurfaceFlag,
} from "../utils/surface";
import { useNavbarStack } from "./navbar";
import { useNavAnimate } from "./nav";
import {
  useAnimationTrigger,
  type AnimationTrigger,
} from "../utils/use-enter-viewport";

// Toggle styles
const toggleStyles = cva(
  [
    // Layout. The name is unused; the button itself is the pop face.
    "relative inline-flex w-full items-center justify-between gap-2",

    // Border and typography
    "border-border font-mono text-sm font-bold uppercase tracking-wide",

    // Pop when the menu is open.
    "transition-[translate] duration-200 ease-out",

    // Keyboard focus
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-ring focus-visible:ring-offset-2",

    // Disabled state and reduced motion
    "disabled:pointer-events-none disabled:bg-disabled disabled:text-disabled-foreground",
    "motion-reduce:transition-none",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          // Fill and ink
          "bg-main text-main-foreground",

          // Surface for outline children.
          "[--surface:var(--main)] [--surface-foreground:var(--main-foreground)] [--outline-button-fill:var(--chart-2)]",
        ].join(" "),
        secondary: [
          // Fill and ink
          "bg-chart-2 text-main-foreground",

          // Surface for outline children.
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
    },
    defaultVariants: {
      variant: "outline",
      size: "md",
    },
  },
);

// Menu item styles
const itemStyles = cva(
  [
    // Layout and stacking. The name scopes hover to this item.
    "group/menu relative isolate block w-full px-4 py-2 text-left",

    // Typography
    "font-mono text-sm font-bold uppercase tracking-wide",

    // Keyboard focus
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",

    // Disabled state
    "disabled:pointer-events-none disabled:bg-disabled disabled:text-disabled-foreground",
    "aria-disabled:pointer-events-none aria-disabled:bg-disabled aria-disabled:text-disabled-foreground",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: "bg-main text-main-foreground",
        secondary: "bg-chart-2 text-main-foreground",
        outline: "bg-[var(--surface)] text-[var(--surface-foreground)]",
      },
      active: {
        true: "bg-main text-main-foreground",
        false: "",
      },
    },
    defaultVariants: {
      variant: "outline",
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
    "group-hover/menu:scale-x-100 group-focus-visible/menu:scale-x-100",

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

type DropdownContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  menuId: string;
  shadow: boolean;
  border: boolean;
  rounded: boolean;
  fluid: boolean;
  animate: AnimationTrigger | undefined;
};

const DropdownContext = createContext<DropdownContextValue | null>(null);

function useDropdown() {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error("Dropdown parts must render inside Dropdown");
  }
  return context;
}

function hoverInk(
  variant: "primary" | "secondary" | "outline" | null | undefined,
) {
  if (variant === "primary") {
    return "group-hover/menu:text-foreground group-focus-visible/menu:text-foreground";
  }

  return "group-hover/menu:text-main-foreground group-focus-visible/menu:text-main-foreground";
}

// Holds the menu through the close so it can travel back into its shadow.
function useMenuPresence(open: boolean, animate: boolean) {
  const [present, setPresent] = useState(open);
  const [phase, setPhase] = useState<"in" | "out">(open ? "out" : "in");

  useEffect(() => {
    if (!animate) {
      setPresent(open);
      setPhase(open ? "out" : "in");
      return;
    }

    if (!open) {
      setPhase("in");
      return;
    }

    setPresent(true);
    setPhase("in");

    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setPhase("out"));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [open, animate]);

  useEffect(() => {
    if (!animate || open || !present) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPresent(false);
      return;
    }

    const id = window.setTimeout(() => setPresent(false), 250);
    return () => window.clearTimeout(id);
  }, [animate, open, present, phase]);

  function onTransitionEnd(event: TransitionEvent<HTMLElement>) {
    if (event.target !== event.currentTarget) return;
    if (event.propertyName !== "translate") return;
    if (!open) setPresent(false);
  }

  return { present, phase, onTransitionEnd };
}

// Dropdown props
export type DropdownProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  disabled?: boolean;
  rounded?: boolean;
  shadow?: boolean;
  border?: boolean;
  fluid?: boolean;
  animate?: AnimationTrigger;
  wrapperClassName?: string;
};

// Main Dropdown component
export function Dropdown({
  className,
  children,
  disabled = false,
  rounded: roundedProp,
  shadow: shadowProp,
  border: borderProp,
  fluid = false,
  animate: animateProp,
  wrapperClassName,
  ...props
}: DropdownProps) {
  const rounded = useSurfaceFlag(roundedProp, "rounded", false);
  const shadow = useSurfaceFlag(shadowProp, "shadow", true);
  const border = useSurfaceFlag(borderProp, "border", true);
  const animate = useSurfaceAnimate(animateProp);
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const ref = useRef<HTMLDivElement>(null);

  // Close on an outside click or Escape.
  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!ref.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <DropdownContext.Provider
      value={{
        open,
        setOpen,
        menuId,
        shadow,
        border,
        rounded,
        fluid,
        animate,
      }}
    >
      <SurfaceProvider rounded={rounded}>
      <div
        ref={ref}
        aria-disabled={disabled || undefined}
        className={twMerge(
          "relative",
          fluid ? "flex w-full" : "inline-flex w-fit",
          disabled && "pointer-events-none opacity-70",
          wrapperClassName,
          className,
        )}
        {...props}
      >
        {children}
      </div>
      </SurfaceProvider>
    </DropdownContext.Provider>
  );
}

// Dropdown toggle props
export type DropdownToggleProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof toggleStyles> & {
    rounded?: boolean;
    shadow?: boolean;
    border?: boolean;
    animate?: AnimationTrigger;
    caret?: boolean;
  };

// Dropdown item props
export type DropdownItemProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof itemStyles> & {
    href?: string;
    active?: boolean;
    disabled?: boolean;
  };

// Dropdown menu props
export type DropdownMenuProps = HTMLAttributes<HTMLDivElement> & {
  rounded?: boolean;
  animate?: boolean;
  border?: boolean;
  shadow?: boolean;
  align?: "left" | "right";
};

// Main DropdownToggle component
export function DropdownToggle({
  className,
  variant,
  size,
  rounded,
  shadow: shadowProp,
  border: borderProp,
  animate: animateProp,
  caret = true,
  children,
  type = "button",
  ...props
}: DropdownToggleProps) {
  const {
    open,
    setOpen,
    menuId,
    shadow: groupShadow,
    border: groupBorder,
    rounded: groupRounded,
    fluid,
    animate: groupAnimate,
  } = useDropdown();
  const shadow = shadowProp ?? groupShadow;
  const border = borderProp ?? groupBorder;
  const isRounded = rounded ?? groupRounded;
  const navAnimate = useNavAnimate();
  const animate = animateProp ?? groupAnimate ?? navAnimate ?? false;
  const { ref, shouldAnimate } = useAnimationTrigger<HTMLDivElement>(animate);
  const entrance = Boolean(animate);

  const button = (
    <button
      type={type}
      className={twMerge(
        [
          toggleStyles({ variant, size }),

          // Opening presses the face into the wrapper shadow. The caret still turns.
          // Flat stays put. An entrance moves that shadow onto the wrapper.
          open &&
            shadow &&
            "translate-x-[var(--shadow-offset-x)] translate-y-[var(--shadow-offset-y)]",
          shouldAnimate && border ? "border-none" : borderPaintClass(border),
          shouldAnimate && "brutal-pop-face",
          faceRadiusClass(isRounded),
          className,
        ]
          .filter(Boolean)
          .join(" "),
      )}
      aria-expanded={open}
      aria-controls={menuId}
      onClick={() => setOpen(!open)}
      {...props}
    >
      {shouldAnimate && border && (
        <DrawBorder
          animate
          radius={isRounded ? "var(--radius)" : undefined}
          className="z-10"
        />
      )}
      <span className="relative z-10">{children}</span>
      {caret ? (
        <ChevronUp
          aria-hidden="true"
          className={twMerge(
            [
              // Caret. Points up while closed.
              "relative z-10 size-4 shrink-0",

              // Turn down while the menu is open.
              "transition-transform duration-200 ease-out",
              open && "rotate-180",

              // Reduced motion
              "motion-reduce:transition-none",
            ]
              .filter(Boolean)
              .join(" "),
          )}
        />
      ) : null}
    </button>
  );

  if (!entrance && !shadow) return button;

  return (
    <div
      ref={entrance ? ref : undefined}
      data-pop-direction={shouldAnimate ? "out" : undefined}
      className={twMerge(
        [
          // The shadow stays on this box so the face can press into it.
          "relative isolate",
          fluid || entrance ? "flex w-full" : "inline-flex w-fit",
          shadow && "shadow-[var(--shadow)]",
          shouldAnimate && "animate-brutal-pop",
          isRounded && "rounded-[var(--radius)]",
        ]
          .filter(Boolean)
          .join(" "),
      )}
    >
      {button}
    </div>
  );
}

// Main DropdownItem component
export function DropdownItem({
  href,
  active = false,
  disabled = false,
  className,
  variant,
  children,
  onClick,
  ...props
}: DropdownItemProps) {
  const { setOpen } = useDropdown();
  const itemClassName = twMerge(itemStyles({ variant, active }), className);
  const body = (
    <>
      <span
        className={twMerge("relative z-10", !disabled && hoverInk(variant))}
      >
        {children}
      </span>
      {!disabled && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        >
          <span className={fillStyles({ variant })} />
        </span>
      )}
    </>
  );

  if (href && !disabled) {
    return (
      <a
        href={href}
        className={itemClassName}
        aria-current={active ? "page" : undefined}
        onClick={(event) => {
          onClick?.(event);
          setOpen(false);
        }}
        {...props}
      >
        {body}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={itemClassName}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      onClick={(event) => {
        onClick?.(event);
        if (!disabled) setOpen(false);
      }}
      {...props}
    >
      {body}
    </button>
  );
}

// Main DropdownMenu component.
// animate pops the menu out of its shadow when it opens.
export function DropdownMenu({
  className,
  rounded,
  animate: animateProp,
  border,
  shadow: shadowProp,
  align = "left",
  children,
  ...props
}: DropdownMenuProps) {
  const {
    open,
    menuId,
    shadow: groupShadow,
    border: groupBorder,
    rounded: groupRounded,
    fluid,
    animate: groupAnimate,
  } = useDropdown();
  const shadow = shadowProp ?? groupShadow;
  const showBorder = border ?? groupBorder;
  const isRounded = rounded ?? groupRounded;
  const animate = animateProp ?? Boolean(groupAnimate);
  const stack = useNavbarStack();
  const { present, phase, onTransitionEnd } = useMenuPresence(open, animate);

  // Keep the navbar above later siblings until the menu has finished closing.
  useEffect(() => {
    if (!present || !stack) return;
    stack.raise();
    return () => stack.release();
  }, [present, stack]);

  if (!present) return null;

  const face = (
    <div
      id={menuId}
      role="menu"
      className={twMerge(
        [
          // Layout and stacking
          "relative z-20 flex min-w-48 flex-col",

          // Drawn stroke while the menu is animated, otherwise the resting border.
          showBorder && animate ? "border-none" : borderPaintClass(Boolean(showBorder)),
          "bg-[var(--surface)] text-[var(--surface-foreground)]",
          faceRadiusClass(Boolean(isRounded)),
          className,
        ]
          .filter(Boolean)
          .join(" "),
      )}
      {...props}
    >
      {showBorder && animate && (
        <DrawBorder
          animate
          radius={isRounded ? "var(--radius)" : undefined}
          className="z-10"
        />
      )}
      {children}
    </div>
  );

  return (
    <div
      className={twMerge(
        [
          // Drop below the toggle. right keeps a trailing toggle on the page.
          "absolute top-full z-30 mt-2",
          align === "right" ? "right-0" : "left-0",
          fluid && "w-full",

          // The shadow appears once the face has popped out.
          shadow && phase === "out" && "shadow-[var(--shadow)]",
          isRounded && "rounded-[var(--radius)]",
        ]
          .filter(Boolean)
          .join(" "),
      )}
    >
      <div
        data-pop-direction={phase}
        className={twMerge(
          [
            // Pop out of the shadow on open, and back into it on close.
            // A flat menu stays put.
            animate && shadow && "transition-[translate] duration-200 ease-out",
            animate &&
              shadow &&
              phase === "in" &&
              "translate-x-[var(--shadow-offset-x)] translate-y-[var(--shadow-offset-y)]",
            animate &&
              shadow &&
              phase === "out" &&
              "translate-x-0 translate-y-0",

            // Reduced motion
            "motion-reduce:transition-none",
          ]
            .filter(Boolean)
            .join(" "),
        )}
        onTransitionEnd={animate ? onTransitionEnd : undefined}
      >
        {face}
      </div>
    </div>
  );
}
