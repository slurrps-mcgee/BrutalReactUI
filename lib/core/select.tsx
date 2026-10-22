/* eslint-disable react-hooks/set-state-in-effect -- menu presence coordinates the open, then the pop */
import {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
  type AnimationEvent,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, ChevronDown } from "lucide-react";
import { twMerge } from "tailwind-merge";
import DrawBorder from "../utils/draw-border";
import {
  SurfaceProvider,
  borderPaintClass,
  faceRadiusClass,
  useSurfaceAnimate,
  useSurfaceFlag,
} from "../utils/surface";
import { useControllableState } from "../utils/use-controllable-state";
import { useDismissableLayer } from "../utils/use-dismissable-layer";
import {
  useAnimationTrigger,
  type AnimationTrigger,
} from "../utils/use-enter-viewport";
import { useFormFieldControl } from "./form";

// Select trigger styles
const selectStyles = cva(
  [
    // Layout, border, and typography
    "relative z-10 flex w-full items-center justify-between gap-3 border-border font-mono font-bold",

    // Interaction. A shadowed open pop starts on this face.
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",

    // Disabled and reduced motion
    "disabled:cursor-not-allowed disabled:bg-disabled disabled:text-disabled-foreground",
    "motion-reduce:transition-none",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "bg-main text-main-foreground [--surface:var(--main)] [--surface-foreground:var(--main-foreground)]",
        secondary:
          "bg-chart-2 text-main-foreground [--surface:var(--chart-2)] [--surface-foreground:var(--main-foreground)]",
        outline: "bg-[var(--surface)] text-[var(--surface-foreground)]",
      },
      size: {
        sm: "px-3 py-2 text-xs",
        md: "px-4 py-3 text-sm",
        lg: "px-5 py-4 text-base",
      },
      validity: {
        valid: "border-success",
        invalid: "border-danger",
        neutral: "",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "md",
      validity: "neutral",
    },
  },
);

type OptionRecord = {
  value: string;
  label: string;
  disabled: boolean;
  id: string;
  ref: RefObject<HTMLButtonElement | null>;
};

type SelectContextValue = {
  value: string;
  activeValue: string;
  register: (option: OptionRecord) => () => void;
  select: (value: string) => void;
  setActive: (value: string) => void;
};

const SelectContext = createContext<SelectContextValue | null>(null);

function useSelect() {
  const context = useContext(SelectContext);
  if (!context) throw new Error("SelectOption must render inside Select");
  return context;
}

// A shadowed select starts in the offset and only pops out. Flat stays put.
// Closing presses both faces back into the shadow before the menu leaves.
function useSelectMenuMotion(open: boolean, shadow: boolean) {
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const animate = shadow && !reduced;
  const [prevOpen, setPrevOpen] = useState(open);
  const [present, setPresent] = useState(open);
  const [poppingOut, setPoppingOut] = useState(false);
  const [closing, setClosing] = useState(false);
  const [lifted, setLifted] = useState(false);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setPresent(true);
      setClosing(false);
      setLifted(false);
      setPoppingOut(animate);
    } else if (animate && (poppingOut || lifted)) {
      setPoppingOut(false);
      setLifted(false);
      setClosing(true);
    } else {
      setPoppingOut(false);
      setLifted(false);
      setClosing(false);
      setPresent(false);
    }
  }

  useEffect(() => {
    if (open || !closing) return;
    const id = window.setTimeout(() => {
      setClosing(false);
      setPresent(false);
    }, 450);
    return () => window.clearTimeout(id);
  }, [closing, open]);

  function onAnimationEnd(event: AnimationEvent<HTMLElement>) {
    if (event.target !== event.currentTarget) return;
    if (event.animationName === "brutalPopOut" && open) {
      setPoppingOut(false);
      setLifted(true);
    }
    if (event.animationName === "brutalPopIn" && !open) {
      setClosing(false);
      setPresent(false);
    }
  }

  const menuPresent = open || present;
  const faceMotion = poppingOut ? "out" : closing ? "in" : null;

  return { menuPresent, faceMotion, onAnimationEnd };
}

function optionLabel(children: ReactNode, value: string, textValue?: string) {
  if (textValue) return textValue;
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  return value;
}

// Labels stay available after the menu unmounts its options.
function optionsFromChildren(children: ReactNode) {
  const found: { value: string; label: string }[] = [];
  Children.forEach(children, (child) => {
    if (
      !isValidElement<SelectOptionProps>(child) ||
      child.type !== SelectOption
    ) {
      return;
    }
    const { value, textValue, children: labelNode } = child.props;
    if (typeof value !== "string") return;
    found.push({
      value,
      label: optionLabel(labelNode, value, textValue),
    });
  });
  return found;
}

// Select props
export type SelectProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "onChange"
> &
  VariantProps<typeof selectStyles> & {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    name?: string;
    required?: boolean;
    disabled?: boolean;
    valid?: boolean;
    invalid?: boolean;
    placeholder?: ReactNode;
    rounded?: boolean;
    shadow?: boolean;
    border?: boolean;
    animate?: AnimationTrigger;
    wrapperClassName?: string;
    faceClassName?: string;
    triggerClassName?: string;
    menuClassName?: string;
    children?: ReactNode;
  };

// Main Select component
export function Select({
  className,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  name,
  required = false,
  disabled = false,
  valid: validProp,
  invalid: invalidProp,
  placeholder = "Select an option",
  rounded: roundedProp,
  shadow: shadowProp,
  border: borderProp,
  animate: animateProp,
  wrapperClassName,
  faceClassName,
  variant,
  size,
  triggerClassName,
  menuClassName,
  children,
  ...props
}: SelectProps) {
  const rounded = useSurfaceFlag(roundedProp, "rounded", false);
  const border = useSurfaceFlag(borderProp, "border", true);
  const shadow = useSurfaceFlag(shadowProp, "shadow", true);
  const animate = useSurfaceAnimate(animateProp);
  const { ref: animateRef, shouldAnimate } = useAnimationTrigger<HTMLDivElement>(animate);
  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const [options, setOptions] = useState<OptionRecord[]>([]);
  const [activeValue, setActiveValue] = useState(value);
  const [requiredInvalid, setRequiredInvalid] = useState(false);
  const field = useFormFieldControl();
  const valid = validProp ?? field?.valid ?? false;
  const invalid = invalidProp ?? field?.invalid ?? false;
  const validity =
    requiredInvalid || invalid ? "invalid" : valid ? "valid" : "neutral";
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const typeahead = useRef("");
  const typeaheadTimer = useRef<number | undefined>(undefined);
  const listboxId = useId();
  const generatedTriggerId = useId();
  const triggerId = field?.controlId ?? generatedTriggerId;

  const close = useCallback(() => setOpen(false), [setOpen]);
  const {
    menuPresent,
    faceMotion,
    onAnimationEnd: onMenuAnimationEnd,
  } = useSelectMenuMotion(open, shadow);
  const popEasing = "450ms cubic-bezier(0.2, 0.8, 0.2, 1) both";
  const faceStyle =
    faceMotion === "out"
      ? { animation: `brutalPopOut ${popEasing}` }
      : faceMotion === "in"
        ? { animation: `brutalPopIn ${popEasing}` }
        : undefined;
  useDismissableLayer({ ref: rootRef, enabled: open, onDismiss: close });

  const register = useCallback((option: OptionRecord) => {
    setOptions((current) => [...current, option]);
    return () => {
      setOptions((current) => current.filter((item) => item.id !== option.id));
    };
  }, []);

  const orderedOptions = options.slice().sort((a, b) => {
    if (!a.ref.current || !b.ref.current) return 0;
    return a.ref.current.compareDocumentPosition(b.ref.current) &
      Node.DOCUMENT_POSITION_FOLLOWING
      ? -1
      : 1;
  });
  const enabledOptions = orderedOptions.filter((option) => !option.disabled);
  const declared = optionsFromChildren(children);
  const selected =
    orderedOptions.find((option) => option.value === value) ??
    declared.find((option) => option.value === value);
  const effectiveActiveValue = enabledOptions.some(
    (option) => option.value === activeValue,
  )
    ? activeValue
    : enabledOptions.some((option) => option.value === value)
      ? value
      : (enabledOptions[0]?.value ?? "");
  const active = orderedOptions.find(
    (option) => option.value === effectiveActiveValue,
  );

  useEffect(() => {
    const hidden = rootRef.current?.querySelector<HTMLInputElement>(
      'input[type="hidden"]',
    );
    const form = hidden?.form;
    if (!form || !required || disabled) return;

    function validate(event: Event) {
      if (value) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      setRequiredInvalid(true);
      triggerRef.current?.focus();
    }

    form.addEventListener("submit", validate);
    return () => form.removeEventListener("submit", validate);
  }, [disabled, required, value]);

  useEffect(() => {
    const hidden = rootRef.current?.querySelector<HTMLInputElement>(
      'input[type="hidden"]',
    );
    const form = hidden?.form;
    if (!form) return;

    function reset() {
      setValue(defaultValue);
      setRequiredInvalid(false);
      setOpen(false);
    }

    form.addEventListener("reset", reset);
    return () => form.removeEventListener("reset", reset);
  }, [defaultValue, setOpen, setValue]);

  function choose(nextValue: string) {
    setValue(nextValue);
    setActiveValue(nextValue);
    setRequiredInvalid(false);
    setOpen(false);
    triggerRef.current?.focus();
  }

  function moveActive(direction: 1 | -1) {
    if (!enabledOptions.length) return;
    const index = enabledOptions.findIndex(
      (option) => option.value === effectiveActiveValue,
    );
    const nextIndex =
      index < 0
        ? direction === 1
          ? 0
          : enabledOptions.length - 1
        : (index + direction + enabledOptions.length) % enabledOptions.length;
    setActiveValue(enabledOptions[nextIndex]?.value ?? "");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) setOpen(true);
      else moveActive(event.key === "ArrowDown" ? 1 : -1);
      return;
    }
    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      setOpen(true);
      const option =
        event.key === "Home"
          ? enabledOptions[0]
          : enabledOptions[enabledOptions.length - 1];
      setActiveValue(option?.value ?? "");
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (open && effectiveActiveValue) choose(effectiveActiveValue);
      else setOpen(true);
      return;
    }
    if (event.key === "Escape" && open) {
      event.preventDefault();
      setOpen(false);
      return;
    }
    if (event.key.length === 1 && /\S/.test(event.key)) {
      typeahead.current += event.key.toLocaleLowerCase();
      window.clearTimeout(typeaheadTimer.current);
      typeaheadTimer.current = window.setTimeout(() => {
        typeahead.current = "";
      }, 500);
      const match = enabledOptions.find((option) =>
        option.label.toLocaleLowerCase().startsWith(typeahead.current),
      );
      if (match) {
        setActiveValue(match.value);
        if (!open) choose(match.value);
      }
    }
  }

  function toggleOpen() {
    if (!open) {
      setActiveValue(value || enabledOptions[0]?.value || "");
    }
    setOpen(!open);
  }

  return (
    <SurfaceProvider rounded={rounded}>
    <SelectContext.Provider
      value={{
        value,
        activeValue: effectiveActiveValue,
        register,
        select: choose,
        setActive: setActiveValue,
      }}
    >
      <div
        ref={rootRef}
        className={twMerge(
          "relative h-fit w-full self-start",
          validity === "invalid" && "[--shadow-color:var(--danger)]",
          wrapperClassName,
          className,
        )}
        {...props}
      >
        {(name || required) && (
          <input type="hidden" name={name} value={value} disabled={disabled} />
        )}
        <div
          ref={animateRef}
          data-pop-direction={shouldAnimate ? "out" : undefined}
          className={twMerge(
            "relative isolate",
            shouldAnimate && "animate-brutal-pop",
            ((shadow && menuPresent) || (shadow && shouldAnimate)) &&
              "shadow-[var(--shadow)]",
            rounded &&
              (menuPresent
                ? "rounded-t-[var(--radius)]"
                : "rounded-[var(--radius)]"),
          )}
        >
          <button
            ref={triggerRef}
            id={triggerId}
            type="button"
            role="combobox"
            style={faceStyle}
            onAnimationEnd={onMenuAnimationEnd}
            className={twMerge(
              selectStyles({ variant, size, validity }),
              shouldAnimate && border ? "border-none" : borderPaintClass(border),
              shouldAnimate && "brutal-pop-face",
              rounded &&
                menuPresent &&
                "rounded-t-[var(--radius)] rounded-b-none",
              rounded &&
                !menuPresent &&
                faceRadiusClass(true),
              faceClassName,
              triggerClassName,
            )}
            aria-controls={listboxId}
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-activedescendant={open ? active?.id : undefined}
            aria-describedby={
              requiredInvalid || invalid ? field?.feedbackId : undefined
            }
            aria-invalid={requiredInvalid || invalid || undefined}
            aria-required={required || undefined}
            disabled={disabled}
            onClick={toggleOpen}
            onKeyDown={handleKeyDown}
          >
            {shouldAnimate && border && (
              <DrawBorder
                animate
                radius={rounded && !menuPresent ? "var(--radius)" : undefined}
                className="z-10"
              />
            )}
            <span className={twMerge("relative z-10 truncate", !selected && "opacity-60")}>
              {selected?.label ?? placeholder}
            </span>
            <ChevronDown
              aria-hidden="true"
              className={twMerge(
                "size-4 shrink-0 transition-transform duration-200 motion-reduce:transition-none",
                open && "rotate-180",
              )}
            />
          </button>
        </div>
        {menuPresent && (
          <div
            className={twMerge(
              [
                // Sits under the trigger. Its shadow stays put while the face pops.
                "absolute left-0 top-full z-30 -mt-[var(--border-width)] w-full",
                shadow && "shadow-[var(--shadow)]",
                rounded && "rounded-b-[var(--radius)] rounded-t-none",
              ]
                .filter(Boolean)
                .join(" "),
            )}
          >
            <div
              id={listboxId}
              role="listbox"
              aria-labelledby={triggerId}
              style={faceStyle}
              onAnimationEnd={onMenuAnimationEnd}
              className={twMerge(
                [
                  "max-h-64 w-full overflow-auto border-[length:var(--border-width)]",
                  border ? "border-border" : "border-none",
                  "bg-[var(--surface)] text-[var(--surface-foreground)]",
                  rounded && "rounded-b-[var(--radius)] rounded-t-none",
                ]
                  .filter(Boolean)
                  .join(" "),
                menuClassName,
              )}
            >
              {children}
            </div>
          </div>
        )}
      </div>
    </SelectContext.Provider>
    </SurfaceProvider>
  );
}

// SelectOption props
export type SelectOptionProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "value"
> & {
  value: string;
  textValue?: string;
  rounded?: boolean;
  shadow?: boolean;
  border?: boolean;
};

// Select option compound part
export function SelectOption({
  value,
  textValue,
  disabled = false,
  rounded,
  shadow,
  border,
  className,
  children,
  onClick,
  onMouseMove,
  onFocus,
  ...props
}: SelectOptionProps) {
  const {
    value: selectedValue,
    activeValue,
    register,
    select,
    setActive,
  } = useSelect();
  const id = useId();
  const ref = useRef<HTMLButtonElement>(null);
  const label =
    textValue ??
    (typeof children === "string" || typeof children === "number"
      ? String(children)
      : value);

  useEffect(
    () => register({ value, label, disabled, id, ref }),
    [disabled, id, label, register, value],
  );

  const selected = selectedValue === value;
  const active = activeValue === value;

  return (
    <button
      ref={ref}
      id={id}
      type="button"
      role="option"
      tabIndex={-1}
      className={twMerge(
        [
          "flex w-full items-center justify-between gap-3 px-4 py-2 text-left font-mono text-sm font-bold",
          "focus-visible:outline-none",
          border && "border-[length:var(--border-width)] border-border",
          shadow && "shadow-[var(--shadow)]",
          rounded && "rounded-[var(--radius)]",
          active && "bg-main text-main-foreground",
          disabled && "cursor-not-allowed bg-disabled text-disabled-foreground",
        ]
          .filter(Boolean)
          .join(" "),
        className,
      )}
      aria-selected={selected}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      onMouseMove={(event) => {
        onMouseMove?.(event);
        if (!event.defaultPrevented && !disabled) setActive(value);
      }}
      onFocus={(event) => {
        onFocus?.(event);
        if (!event.defaultPrevented && !disabled) setActive(value);
      }}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented && !disabled) select(value);
      }}
      {...props}
    >
      <span>{children}</span>
      {selected && <Check aria-hidden="true" className="size-4 shrink-0" />}
    </button>
  );
}

export default Select;
