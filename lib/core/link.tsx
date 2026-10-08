import type { AnchorHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { MoveRight } from "lucide-react";

// Link styles
const linkStyles = cva(
  [
    // Layout and stacking. Overflow stays inside the link, which has no border to cover a slide.
    "group/action pointer-events-auto relative z-20 inline-grid items-center self-center overflow-hidden whitespace-nowrap pb-1",

    // Typography
    "font-mono font-bold",

    // Focus state
    "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
  ].join(" "),
  {
    variants: {
      // Named so the prop matches the label, underline, and arrow.
      variant: {
        default: "",
        primary: "",
        secondary: "",
      },
      // Type size
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

// Label fill. One glyph layer, so a second copy cannot fringe the letters.
const fillStyles = cva(
  [
    // Layout and stacking
    "relative z-10 col-start-1 row-start-1 inline-flex items-center gap-2",

    // The gradient paints the glyphs, so the text fill stays clear.
    "bg-clip-text [-webkit-text-fill-color:transparent]",

    // Resting position shows the right half of the slide.
    "bg-no-repeat [background-size:200%_100%] [background-position:100%_0]",

    // Reveal on hover and keyboard focus
    "transition-[background-position] duration-300 ease-out",
    "group-hover/action:[background-position:0%_0] group-focus-visible/action:[background-position:0%_0]",

    // Reduced motion
    "motion-reduce:transition-none",
  ].join(" "),
  {
    variants: {
      // Left half is the hover ink. Right half is the resting ink.
      variant: {
        default:
          "bg-[linear-gradient(to_right,var(--outline-button-fill)_50%,var(--foreground)_50%)]",
        primary:
          "bg-[linear-gradient(to_right,var(--chart-2)_50%,var(--main)_50%)]",
        secondary:
          "bg-[linear-gradient(to_right,var(--main)_50%,var(--chart-2)_50%)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

// Underline wipe. The arrow is a stroke, so it takes a color change instead.
const markStyles = cva(
  [
    // Resting position shows the right half of the slide.
    "bg-no-repeat [background-size:200%_100%] [background-position:100%_0]",

    // Reveal on hover and keyboard focus
    "transition-[background-position] duration-300 ease-out",
    "group-hover/action:[background-position:0%_0] group-focus-visible/action:[background-position:0%_0]",

    // Reduced motion
    "motion-reduce:transition-none",
  ].join(" "),
  {
    variants: {
      // Left half is the hover ink. Right half is the resting ink.
      variant: {
        default:
          "bg-[linear-gradient(to_right,var(--outline-button-fill)_50%,var(--foreground)_50%)]",
        primary:
          "bg-[linear-gradient(to_right,var(--chart-2)_50%,var(--main)_50%)]",
        secondary:
          "bg-[linear-gradient(to_right,var(--main)_50%,var(--chart-2)_50%)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

// Arrow ink. A stroke cannot use the text clip, so the color changes with the wipe.
const arrowStyles = cva(
  [
    // Size
    "h-5 w-5 shrink-0",

    // currentColor keeps the stroke visible under the label clip.
    "[-webkit-text-fill-color:currentColor]",

    // Reveal on hover and keyboard focus
    "transition-colors duration-300 ease-out",

    // Reduced motion
    "motion-reduce:transition-none",
  ].join(" "),
  {
    variants: {
      // Resting ink, then the hover ink.
      variant: {
        default: [
          "text-foreground",
          "group-hover/action:text-[var(--outline-button-fill)] group-focus-visible/action:text-[var(--outline-button-fill)]",
        ].join(" "),
        primary: [
          "text-main",
          "group-hover/action:text-chart-2 group-focus-visible/action:text-chart-2",
        ].join(" "),
        secondary: [
          "text-chart-2",
          "group-hover/action:text-main group-focus-visible/action:text-main",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

// Link props
export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof linkStyles> & {
    href: string;
    children: string;
    wrapperClassName?: string;
    faceClassName?: string;
    fillClassName?: string;
  };

// Main Link component
export default function Link({
  href,
  children,
  className,
  variant,
  size,
  wrapperClassName: wrapperClassNameProp,
  faceClassName,
  fillClassName,
  ...props
}: LinkProps) {
  // Wrapper classes
  const isExternal = /^https?:\/\//.test(href);
  const wrapperClassName = twMerge(
    [
      // Layout and stacking
      "relative isolate inline-flex w-fit items-center self-center",

    ]
      .filter(Boolean)
      .join(" "),
    wrapperClassNameProp,
  );

  // Main return
  const link = (
    <a
      href={href}
      className={twMerge(
        [
          linkStyles({ variant, size }),

          // Pop target. Must be the wrapper's direct child.
          faceClassName,
          className,
        ]
          .filter(Boolean)
          .join(" "),
      )}
      {...props}
      target={isExternal ? "_blank" : props.target}
      rel={isExternal ? "noopener noreferrer" : props.rel}
    >
      <span className={twMerge(fillStyles({ variant }), fillClassName)}>
        {children}
        <MoveRight aria-hidden="true" className={arrowStyles({ variant })} />
        <span
          aria-hidden="true"
          className={twMerge(
            [
              // Underline placement
              "absolute bottom-0 left-0 right-0 h-0.5",
              markStyles({ variant }),
            ].join(" "),
          )}
        />
      </span>
    </a>
  );

  return (
    <span
      className={wrapperClassName}
    >
      {link}
    </span>
  );
}
