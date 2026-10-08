import {
  createContext,
  useContext,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import DrawBorder from "../utils/draw-border";
import {
  useAnimationTrigger,
  type AnimationTrigger,
} from "../utils/use-enter-viewport";

const listGroupStyles = cva(
  [
    "relative flex w-full list-none flex-col overflow-hidden",
    "border-[3px] border-border",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: "bg-main text-main-foreground [--list-accent:var(--chart-2)]",
        secondary:
          "bg-chart-2 text-main-foreground [--list-accent:var(--main)]",
        outline:
          "bg-[var(--surface)] text-[var(--surface-foreground)] [--list-accent:var(--main)]",
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

type ListGroupStyleProps = VariantProps<typeof listGroupStyles>;
const ListGroupContext = createContext<ListGroupStyleProps>({
  variant: "outline",
  size: "md",
});

export type ListGroupProps = HTMLAttributes<HTMLUListElement> &
  ListGroupStyleProps & {
    animate?: AnimationTrigger;
    rounded?: boolean;
    shadow?: boolean;
    wrapperClassName?: string;
    faceClassName?: string;
  };

export default function ListGroup({
  className,
  variant,
  size,
  animate = false,
  rounded = false,
  shadow = true,
  wrapperClassName,
  faceClassName,
  ...props
}: ListGroupProps) {
  const { ref, shouldAnimate } =
    useAnimationTrigger<HTMLDivElement>(animate);

  return (
    <ListGroupContext.Provider value={{ variant, size }}>
      <div
        ref={ref}
        className={twMerge(
          "relative isolate w-full",
          shadow && "shadow-[var(--shadow)]",
          rounded && "rounded-[var(--radius)]",
          shouldAnimate && "animate-brutal-pop",
          wrapperClassName,
        )}
        data-pop-direction="out"
      >
        {shouldAnimate && (
          <DrawBorder
            animate
            radius={rounded ? "var(--radius)" : undefined}
            className="z-10"
          />
        )}
        <ul
          className={twMerge(
            listGroupStyles({ variant, size }),
            shouldAnimate ? "border-none brutal-pop-face" : "border-border",
            rounded && "rounded-[var(--radius)]",
            faceClassName,
            className,
          )}
          {...props}
        />
      </div>
    </ListGroupContext.Provider>
  );
}

const itemStyles = cva(
  [
    "relative flex w-full items-center gap-3 border-b-[3px] border-border",
    "font-mono font-bold uppercase tracking-wide last:border-b-0",
    "transition-colors duration-200",
    "focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-inset focus-visible:ring-ring",
    "disabled:pointer-events-none disabled:bg-disabled disabled:text-disabled-foreground",
    "aria-disabled:pointer-events-none aria-disabled:bg-disabled aria-disabled:text-disabled-foreground",
    "motion-reduce:transition-none",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "px-3 py-2",
        md: "px-4 py-3",
        lg: "px-5 py-4",
      },
      active: {
        true: "bg-[var(--list-accent)] text-main-foreground",
        false: "",
      },
      interactive: {
        true: "cursor-pointer hover:bg-[var(--list-accent)] hover:text-main-foreground",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      active: false,
      interactive: false,
    },
  },
);

type SharedItemProps = {
  active?: boolean;
  disabled?: boolean;
};

export type ListGroupItemProps = HTMLAttributes<HTMLLIElement> &
  SharedItemProps;

export function ListGroupItem({
  active = false,
  disabled = false,
  className,
  ...props
}: ListGroupItemProps) {
  const { size } = useContext(ListGroupContext);
  return (
    <li
      aria-current={active ? "true" : undefined}
      aria-disabled={disabled || undefined}
      className={twMerge(itemStyles({ size, active }), className)}
      {...props}
    />
  );
}

export type ListGroupLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  SharedItemProps;

export function ListGroupLink({
  href,
  active = false,
  disabled = false,
  className,
  ...props
}: ListGroupLinkProps) {
  const { size } = useContext(ListGroupContext);
  return (
    <li className="contents">
      <a
        href={disabled ? undefined : href}
        aria-current={active ? "page" : undefined}
        aria-disabled={disabled || undefined}
        className={twMerge(
          itemStyles({ size, active, interactive: !disabled }),
          className,
        )}
        {...props}
      />
    </li>
  );
}

export type ListGroupButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  SharedItemProps;

export function ListGroupButton({
  active = false,
  disabled = false,
  className,
  type = "button",
  ...props
}: ListGroupButtonProps) {
  const { size } = useContext(ListGroupContext);
  return (
    <li className="contents">
      <button
        type={type}
        disabled={disabled}
        aria-current={active ? "true" : undefined}
        className={twMerge(
          itemStyles({ size, active, interactive: !disabled }),
          className,
        )}
        {...props}
      />
    </li>
  );
}
