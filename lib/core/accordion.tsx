import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { twMerge } from "tailwind-merge";
import Collapse, {
  CollapseContent,
  CollapseTrigger,
  type CollapseContentProps,
  type CollapseProps,
  type CollapseTriggerProps,
} from "./collapse";

type AccordionContextValue = {
  disabled: boolean;
  flush: boolean;
  isOpen: (value: string) => boolean;
  registerTrigger: (value: string, trigger: HTMLButtonElement | null) => void;
  toggle: (value: string, open: boolean) => void;
  moveFocus: (
    value: string,
    direction: "next" | "previous" | "first" | "last",
  ) => void;
};

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordion() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("Accordion parts must render inside Accordion");
  }
  return context;
}

type AccordionItemContextValue = {
  disabled: boolean;
  value: string;
};

const AccordionItemContext = createContext<AccordionItemContextValue | null>(
  null,
);

function useAccordionItem() {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error("AccordionTrigger must render inside AccordionItem");
  }
  return context;
}

type AccordionBaseProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "defaultValue"
> & {
  disabled?: boolean;
  flush?: boolean;
  rounded?: boolean;
  children?: ReactNode;
};

export type AccordionSingleProps = AccordionBaseProps & {
  type?: "single";
  value?: string;
  defaultValue?: string;
  collapsible?: boolean;
  onValueChange?: (value: string) => void;
};

export type AccordionMultipleProps = AccordionBaseProps & {
  type: "multiple";
  value?: string[];
  defaultValue?: string[];
  collapsible?: never;
  onValueChange?: (value: string[]) => void;
};

export type AccordionProps = AccordionSingleProps | AccordionMultipleProps;

// Accordion root. It owns selection while each item delegates its animation
// and ARIA linkage to Collapse.
function AccordionRoot(props: AccordionProps) {
  const normalizedProps = props as AccordionBaseProps & {
    type?: "single" | "multiple";
    value?: string | string[];
    defaultValue?: string | string[];
    collapsible?: boolean;
    onValueChange?: (value: string | string[]) => void;
  };
  const {
    type = "single",
    value: controlledValue,
    defaultValue,
    collapsible = true,
    onValueChange,
    disabled = false,
    flush = true,
    rounded = false,
    className,
    children,
    ...domProps
  } = normalizedProps;
  const [singleValue, setSingleValue] = useState(
    type === "multiple" ? "" : ((defaultValue as string | undefined) ?? ""),
  );
  const [multipleValue, setMultipleValue] = useState<string[]>(
    type === "multiple" ? ((defaultValue as string[] | undefined) ?? []) : [],
  );
  const triggers = useRef(new Map<string, HTMLButtonElement>());

  const selected =
    type === "multiple"
      ? new Set((controlledValue as string[] | undefined) ?? multipleValue)
      : new Set(
          [(controlledValue as string | undefined) ?? singleValue].filter(
            Boolean,
          ),
        );

  function updateValue(value: string, open: boolean) {
    if (disabled) return;

    if (type === "multiple") {
      const next = new Set(selected);
      if (open) next.add(value);
      else next.delete(value);
      const values = Array.from(next);
      onValueChange?.(values);
      if (controlledValue === undefined) setMultipleValue(values);
      return;
    }

    const current = Array.from(selected)[0] ?? "";
    const next = open ? value : current === value && collapsible ? "" : current;
    if (next === current) return;
    onValueChange?.(next);
    if (controlledValue === undefined) setSingleValue(next);
  }

  function orderedTriggers() {
    return Array.from(triggers.current.values())
      .filter((trigger) => !trigger.disabled)
      .sort((first, second) => {
        const position = first.compareDocumentPosition(second);
        return position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
      });
  }

  const context: AccordionContextValue = {
    disabled,
    flush,
    isOpen: (value) => selected.has(value),
    registerTrigger: (value, trigger) => {
      if (trigger) triggers.current.set(value, trigger);
      else triggers.current.delete(value);
    },
    toggle: updateValue,
    moveFocus: (value, direction) => {
      const items = orderedTriggers();
      if (items.length === 0) return;
      const current = triggers.current.get(value);
      const index = current ? items.indexOf(current) : -1;
      let target = 0;

      if (direction === "last") target = items.length - 1;
      if (direction === "next") target = (index + 1) % items.length;
      if (direction === "previous") {
        target = (index - 1 + items.length) % items.length;
      }

      items[target]?.focus();
    },
  };

  return (
    <AccordionContext.Provider value={context}>
      <div
        className={twMerge(
          [
            // Layout
            "flex w-full flex-col",
            flush ? "gap-0" : "gap-3",
            rounded && "overflow-hidden rounded-[var(--radius)]",
            className,
          ]
            .filter(Boolean)
            .join(" "),
        )}
        data-orientation="vertical"
        data-flush={flush ? "" : undefined}
        {...domProps}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

// Accordion item props
export type AccordionItemProps = Omit<
  CollapseProps,
  "open" | "defaultOpen" | "onOpenChange"
> & {
  value: string;
};

// One animated accordion panel.
export function AccordionItem({
  value,
  disabled = false,
  className,
  children,
  ...props
}: AccordionItemProps) {
  const accordion = useAccordion();
  const open = accordion.isOpen(value);
  const isDisabled = accordion.disabled || disabled;

  return (
    <AccordionItemContext.Provider value={{ disabled: isDisabled, value }}>
      <Collapse
        open={open}
        disabled={isDisabled}
        onOpenChange={(nextOpen) => accordion.toggle(value, nextOpen)}
        className={twMerge(
          [
            // Surface and grouped borders
            "bg-[var(--surface)] text-[var(--surface-foreground)]",
            accordion.flush && "-mt-[3px] first:mt-0",
            className,
          ]
            .filter(Boolean)
            .join(" "),
        )}
        data-accordion-value={value}
        {...props}
      >
        {children}
      </Collapse>
    </AccordionItemContext.Provider>
  );
}

// Accordion trigger props
export type AccordionTriggerProps = CollapseTriggerProps & {
  headingLevel?: number;
};

// Heading-wrapped trigger with WAI-ARIA accordion keyboard navigation.
export function AccordionTrigger({
  headingLevel = 3,
  onKeyDown,
  ...props
}: AccordionTriggerProps) {
  const accordion = useAccordion();
  const item = useAccordionItem();
  const register = useCallback(
    (trigger: HTMLButtonElement | null) => {
      accordion.registerTrigger(item.value, trigger);
    },
    [accordion, item.value],
  );

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;

    const direction =
      event.key === "ArrowDown"
        ? "next"
        : event.key === "ArrowUp"
          ? "previous"
          : event.key === "Home"
            ? "first"
            : event.key === "End"
              ? "last"
              : null;

    if (direction) {
      event.preventDefault();
      accordion.moveFocus(item.value, direction);
    }
  }

  return (
    <div role="heading" aria-level={headingLevel}>
      <CollapseTrigger
        ref={register}
        disabled={item.disabled}
        onKeyDown={handleKeyDown}
        {...props}
      />
    </div>
  );
}

// Accordion content is Collapse content with the same ARIA linkage.
export function AccordionContent(props: CollapseContentProps) {
  return <CollapseContent {...props} />;
}

// Compound and named APIs
// eslint-disable-next-line react-refresh/only-export-components
export const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
});

export default Accordion;
