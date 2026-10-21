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
import { SurfaceProvider, useSurfaceAnimate, useSurfaceFlag } from "../utils/surface";
import {
  useAnimationTrigger,
  type AnimationTrigger,
} from "../utils/use-enter-viewport";

const listGroupStyles = cva(
  [
    // Layout. The stroke is drawn on this face, so it must not clip it.
    "relative flex w-full list-none flex-col overflow-visible",

    // Border and typography
    "border-[3px] border-border",

    // Dividers. The control inside a contents row is the box that can paint.
    "[&>li:not(:last-child)]:border-b-[3px] [&>li:not(:last-child)]:border-border",
    "[&>li.contents:not(:last-child)>*]:border-b-[3px]",
    "[&>li.contents:not(:last-child)>*]:border-border",
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

// Item fills sit inside the 3px stroke so a rounded corner is one curve, not two.
function itemRadius(rounded: boolean) {
  if (!rounded) return "";
  return [
    "[&>li:first-of-type]:rounded-t-[max(0px,calc(var(--radius)-3px))]",
    "[&>li.contents:first-of-type>*]:rounded-t-[max(0px,calc(var(--radius)-3px))]",
    "[&>li:last-child]:rounded-b-[max(0px,calc(var(--radius)-3px))]",
    "[&>li.contents:last-child>*]:rounded-b-[max(0px,calc(var(--radius)-3px))]",
  ].join(" ");
}

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
    border?: boolean;
    wrapperClassName?: string;
    faceClassName?: string;
  };

export default function ListGroup({
  className,
  variant,
  size,
  animate: animateProp,
  rounded: roundedProp,
  shadow: shadowProp,
  border: borderProp,
  wrapperClassName,
  faceClassName,
  children,
  ...props
}: ListGroupProps) {
  const animate = useSurfaceAnimate(animateProp);
  const rounded = useSurfaceFlag(roundedProp, "rounded", false);
  const shadow = useSurfaceFlag(shadowProp, "shadow", true);
  const border = useSurfaceFlag(borderProp, "border", true);
  const { ref, shouldAnimate } = useAnimationTrigger<HTMLDivElement>(animate);
  const showShadow = shadow || Boolean(animate);

  return (
    <ListGroupContext.Provider value={{ variant, size }}>
      <div
        ref={ref}
        className={twMerge(
          [
            // Layout and stacking. The face grows with a stretched parent so the shadow meets the stroke.
            "relative isolate flex w-full flex-col",

            // Shadow
            showShadow && "shadow-[var(--shadow)]",
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
        <ul
          className={twMerge(
            [
              listGroupStyles({ variant, size }),
              itemRadius(rounded),
              rounded && !shouldAnimate && "overflow-hidden",

              // Fill the shadow box when a grid or flex parent stretches the wrapper.
              "flex-1",

              // Resting stroke, or none while the SVG draws it. border false drops both.
              !border
                ? "border-none"
                : shouldAnimate
                  ? "border-transparent"
                  : "border-border",
              !border &&
                "[&>li:not([data-border=true])]:!border-none [&>li.contents:not([data-border=true])>*]:!border-none [&>li[data-border=true]:not(:first-child)]:border-t-[3px] [&>li[data-border=true]:not(:first-child)]:border-border [&>li.contents[data-border=true]:not(:first-child)>*]:border-t-[3px] [&>li.contents[data-border=true]:not(:first-child)>*]:border-border",
              "[&>li[data-border=false]]:!border-b-0 [&>li.contents[data-border=false]>*]:!border-b-0",
              "[&>li[data-rounded=false]]:!rounded-none [&>li.contents[data-rounded=false]>*]:!rounded-none",

              // Pop target. Must be the wrapper's direct child.
              shouldAnimate && "brutal-pop-face",
              rounded && "rounded-[var(--radius)]",
              faceClassName,
              className,
            ]
              .filter(Boolean)
              .join(" "),
          )}
          {...props}
        >
          {/* Border. Inside the face so the stroke travels with the pop. */}
          {shouldAnimate && border && (
            <DrawBorder
              animate
              radius={rounded ? "var(--radius)" : undefined}
              className="z-10"
            />
          )}
          <SurfaceProvider
            shadow={showShadow}
            border={border}
            rounded={rounded}
            animate={animate}
          >
            {children}
          </SurfaceProvider>
        </ul>
      </div>
    </ListGroupContext.Provider>
  );
}

const itemStyles = cva(
  [
    // Layout. The row border is painted by the list so the last row can drop it.
    "relative flex w-full items-center gap-3",

    // Typography
    "font-mono font-bold uppercase tracking-wide",

    // Interaction
    "transition-colors duration-200",

    // Keyboard focus
    "focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-inset focus-visible:ring-ring",

    // Disabled state and reduced motion
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
  border?: boolean;
  rounded?: boolean;
  shadow?: boolean;
  animate?: AnimationTrigger;
};

function useItemChrome({
  border,
  rounded,
  shadow,
}: Pick<SharedItemProps, "border" | "rounded" | "shadow">) {
  const showBorder = useSurfaceFlag(border, "border", true);
  return {
    // The list frame owns the shared shadow. A row paints one only when it asks.
    shadow: shadow === true,
    // Inherited radius stays on the frame. A row can force its own or opt out.
    roundClass:
      rounded === false
        ? "!rounded-none"
        : rounded === true
          ? "rounded-[var(--radius)]"
          : "",
    dataBorder: showBorder ? "true" : "false",
    dataRounded: rounded === false ? "false" : undefined,
  };
}

export type ListGroupItemProps = HTMLAttributes<HTMLLIElement> &
  SharedItemProps;

export function ListGroupItem({
  active = false,
  disabled = false,
  border,
  rounded,
  shadow,
  animate,
  className,
  ...props
}: ListGroupItemProps) {
  const { size } = useContext(ListGroupContext);
  const chrome = useItemChrome({ border, rounded, shadow });
  return (
    <li
      aria-current={active ? "true" : undefined}
      aria-disabled={disabled || undefined}
      data-border={chrome.dataBorder}
      data-rounded={chrome.dataRounded}
      className={twMerge(
        itemStyles({ size, active }),
        chrome.roundClass,
        chrome.shadow && "shadow-[var(--shadow)]",
        animate && "animate-brutal-pop",
        className,
      )}
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
  border,
  rounded,
  shadow,
  className,
  ...props
}: ListGroupLinkProps) {
  const { size } = useContext(ListGroupContext);
  const chrome = useItemChrome({ border, rounded, shadow });
  return (
    <li className="contents" data-border={chrome.dataBorder} data-rounded={chrome.dataRounded}>
      <a
        href={disabled ? undefined : href}
        aria-current={active ? "page" : undefined}
        aria-disabled={disabled || undefined}
        className={twMerge(
          itemStyles({ size, active, interactive: !disabled }),
          chrome.roundClass,
          chrome.shadow && "shadow-[var(--shadow)]",
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
  border,
  rounded,
  shadow,
  className,
  type = "button",
  ...props
}: ListGroupButtonProps) {
  const { size } = useContext(ListGroupContext);
  const chrome = useItemChrome({ border, rounded, shadow });
  return (
    <li className="contents" data-border={chrome.dataBorder} data-rounded={chrome.dataRounded}>
      <button
        type={type}
        disabled={disabled}
        aria-current={active ? "true" : undefined}
        className={twMerge(
          itemStyles({ size, active, interactive: !disabled }),
          chrome.roundClass,
          chrome.shadow && "shadow-[var(--shadow)]",
          className,
        )}
        {...props}
      />
    </li>
  );
}
