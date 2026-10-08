/* eslint-disable react-hooks/set-state-in-effect -- menu presence coordinates staged enter and exit animation state */
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type AnimationEvent,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
  type TransitionEvent,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { ChevronUp } from "lucide-react";
import DrawBorder from "../utils/draw-border";

type DropdownContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  menuId: string;
};

const DropdownContext = createContext<DropdownContextValue | null>(null);

function useDropdown() {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error("Dropdown parts must render inside Dropdown");
  }
  return context;
}

// Dropdown props
export type DropdownProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

// Main Dropdown component
export function Dropdown({ className, children, ...props }: DropdownProps) {
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
    <DropdownContext.Provider value={{ open, setOpen, menuId }}>
      <div ref={ref} className={twMerge("relative", className)} {...props}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

// Toggle styles
const toggleStyles = cva(
  [
    // Layout. The name is unused; the button itself is the pop face.
    "relative inline-flex w-full items-center justify-between gap-2",

    // Border and typography
    "border-[3px] border-border font-mono text-sm font-bold uppercase tracking-wide",

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

// Dropdown toggle props
export type DropdownToggleProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof toggleStyles> & {
    rounded?: boolean;
  };

// Main DropdownToggle component
export function DropdownToggle({
  className,
  variant,
  size,
  rounded = false,
  children,
  type = "button",
  ...props
}: DropdownToggleProps) {
  const { open, setOpen, menuId } = useDropdown();

  return (
    <button
      type={type}
      className={twMerge(
        [
          toggleStyles({ variant, size }),

          // Lift the toggle off the page while its menu is open.
          open &&
            "z-20 shadow-[var(--shadow)] [translate:calc(var(--shadow-offset-x)*-1)_calc(var(--shadow-offset-y)*-1)]",
          rounded && "rounded-[var(--radius)]",
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
      <span className="relative z-10">{children}</span>
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
    </button>
  );
}

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

function hoverInk(
  variant: "primary" | "secondary" | "outline" | null | undefined,
) {
  if (variant === "primary") {
    return "group-hover/menu:text-foreground group-focus-visible/menu:text-foreground";
  }

  return "group-hover/menu:text-main-foreground group-focus-visible/menu:text-main-foreground";
}

// Dropdown item props
export type DropdownItemProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof itemStyles> & {
    href?: string;
    active?: boolean;
    disabled?: boolean;
  };

// Main DropdownItem component
export function DropdownItem({
  href,
  active = false,
  disabled = false,
  className,
  variant,
  children,
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
        onClick={() => setOpen(false)}
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
      onClick={() => {
        if (!disabled) setOpen(false);
      }}
      {...props}
    >
      {body}
    </button>
  );
}

// Holds the menu through the close so it can travel back into its shadow.
// When the border draws, the pop waits until that stroke finishes.
function useMenuPresence(
  open: boolean,
  animate: boolean,
  waitForBorder: boolean,
) {
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

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (waitForBorder && !reduced) return;

    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setPhase("out"));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [open, animate, waitForBorder]);

  useEffect(() => {
    if (!animate || !open || !present || !waitForBorder) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // The stroke is 800ms. This releases the pop if the draw never reports an end.
    const id = window.setTimeout(() => setPhase("out"), 1100);
    return () => window.clearTimeout(id);
  }, [animate, open, present, waitForBorder]);

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

  function onAnimationEnd(event: AnimationEvent<HTMLElement>) {
    if (event.animationName !== "drawBorder") return;
    if (open) setPhase("out");
  }

  return { present, phase, onTransitionEnd, onAnimationEnd };
}

// Dropdown menu props
export type DropdownMenuProps = HTMLAttributes<HTMLDivElement> & {
  rounded?: boolean;
  animate?: boolean;
  border?: boolean;
};

// Main DropdownMenu component.
// animate draws the border, then reveals the shadow and pops the menu out.
export function DropdownMenu({
  className,
  rounded = false,
  animate = true,
  border = true,
  children,
  ...props
}: DropdownMenuProps) {
  const { open, menuId } = useDropdown();
  const { present, phase, onTransitionEnd, onAnimationEnd } = useMenuPresence(
    open,
    animate,
    animate && border,
  );

  if (!present) return null;

  const face = (
    <div
      id={menuId}
      role="menu"
      className={twMerge(
        [
          // Layout and stacking
          "relative z-20 flex min-w-48 flex-col",

          // Border. Drawn while animate is on, otherwise a resting stroke.
          "border-[3px]",
          border && animate && "border-none",
          border && !animate && "border-border",
          !border && "border-none",
          "bg-[var(--surface)] text-[var(--surface-foreground)]",
          rounded && "rounded-[var(--radius)]",
          className,
        ]
          .filter(Boolean)
          .join(" "),
      )}
      {...props}
    >
      {border && animate && (
        <DrawBorder
          animate
          radius={rounded ? "var(--radius)" : undefined}
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
          // Drop below the toggle.
          "absolute left-0 top-full z-30 mt-2",

          // The shadow appears only after the border finishes, so no edge
          // peeks out while the face is sitting in its starting position.
          phase === "out" && "shadow-[var(--shadow)]",
          rounded && "rounded-[var(--radius)]",
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
            animate && "transition-[translate] duration-200 ease-out",
            animate &&
              phase === "in" &&
              "translate-x-[var(--shadow-offset-x)] translate-y-[var(--shadow-offset-y)]",
            animate && phase === "out" && "translate-x-0 translate-y-0",

            // Reduced motion
            "motion-reduce:transition-none",
          ]
            .filter(Boolean)
            .join(" "),
        )}
        onTransitionEnd={animate ? onTransitionEnd : undefined}
        onAnimationEnd={animate && border ? onAnimationEnd : undefined}
      >
        {face}
      </div>
    </div>
  );
}
