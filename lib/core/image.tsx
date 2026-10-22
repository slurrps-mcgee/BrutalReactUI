import { useLayoutEffect, useRef, useState, type HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import type { ProjectImage } from "../types/types";
import DrawBorder from "../utils/draw-border";
import {
  borderPaintClass,
  faceRadiusClass,
} from "../utils/surface";
import {
  useAnimationTrigger,
  type AnimationTrigger,
} from "../utils/use-enter-viewport";

// Image styles
const imageStyles = [
  // Layout and stacking.
  "relative z-10 aspect-video w-full overflow-visible",

  // Border and fill. Padding-box keeps the fill inside the stroke, so a rounded
  // corner cannot show it past the curve.
  "bg-secondary-background bg-clip-padding",

  // Surface for outline children. Hover slide stays main.
  "[--surface:var(--secondary-background)] [--surface-foreground:var(--foreground)] [--outline-button-fill:var(--main)]",
].join(" ");

// Image props
export type ImageProps = HTMLAttributes<HTMLDivElement> & {
  image: ProjectImage;
  title: string;
  animate?: AnimationTrigger;
  rounded?: boolean;
  shadow?: boolean;
  border?: boolean;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  wrapperClassName?: string;
  faceClassName?: string;
};

// Main Image component
export default function Image({
  image,
  title,
  className,
  animate = false,
  rounded = false,
  shadow = true,
  border = true,
  disabled = false,
  size = "md",
  wrapperClassName: wrapperClassNameProp,
  faceClassName,
  ...props
}: ImageProps) {
  // Animation trigger
  const { ref, shouldAnimate } = useAnimationTrigger<HTMLDivElement>(animate);
  const faceRef = useRef<HTMLDivElement>(null);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const failed = failedSrc === image.src;
  // Used border width. A 3px stroke can snap, so the picture has to cover
  // that same border box or the face fill shows in the rounded corners.
  const [borderWidth, setBorderWidth] = useState(border ? 3 : 0);

  useLayoutEffect(() => {
    const face = faceRef.current;
    if (!face) return;

    const read = () => {
      const used = Number.parseFloat(getComputedStyle(face).borderTopWidth);
      const next = Number.isFinite(used) && used > 0 ? used : 0;
      setBorderWidth((current) => (current === next ? current : next));
    };

    read();
    const observer = new ResizeObserver(read);
    observer.observe(face);
    return () => observer.disconnect();
  }, [border]);

  // Wrapper classes
  const wrapperClassName = twMerge(
    [
      // Layout and stacking
      "relative isolate block w-full",

      // Hard offset. A flat face stays put.
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
    <div
      ref={ref}
      className={wrapperClassName}
      data-pop-direction="out"
      {...props}
    >
      <div
        ref={faceRef}
        className={twMerge(
          [
            imageStyles,

            // Drawn stroke, or the resting border. border false drops both.
            shouldAnimate && border ? "border-none" : borderPaintClass(border),

            // Pop target. Must be the wrapper's direct child.
            shouldAnimate && "brutal-pop-face",
            faceRadiusClass(rounded),
            size === "sm" && "text-xs",
            size === "lg" && "text-base",
            disabled && "pointer-events-none opacity-70",
            faceClassName,
            className,
          ]
            .filter(Boolean)
            .join(" "),
        )}
      >
        <div
          className={twMerge(
            "absolute overflow-hidden",
            faceRadiusClass(rounded),
          )}
          style={{ inset: borderWidth > 0 ? -borderWidth : 0 }}
        >
          <img
            src={image.src}
            alt={`Screenshot of ${title}`}
            width={image.width}
            height={image.height}
            loading="lazy"
            decoding="async"
            onError={() => setFailedSrc(image.src)}
            className={twMerge(
              "block h-full w-full object-cover object-top",
              failed && "sr-only",
            )}
          />
        </div>

        {/* Resting stroke. The picture covers the face border, so paint it again on top. */}
        {border && !shouldAnimate && (
          <span
            aria-hidden
            className={twMerge(
              "pointer-events-none absolute z-20 border-solid border-border",
              rounded && "rounded-[var(--radius)]",
            )}
            style={{ inset: -borderWidth, borderWidth }}
          />
        )}

        {shouldAnimate && border && (
          <DrawBorder
            animate
            radius={rounded ? "var(--radius)" : undefined}
            className="z-20"
          />
        )}
      </div>
    </div>
  );
}
