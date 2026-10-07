import { useState, type HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import type { ProjectImage } from "../types/types";
import DrawBorder from "../utils/draw-border";
import {
  useAnimationTrigger,
  type AnimationTrigger,
} from "../utils/use-enter-viewport";

// Image styles
const imageStyles = [
  // Layout and stacking
  "relative z-10 aspect-video w-full",

  // Border
  "border-[3px] bg-secondary-background [--surface:var(--secondary-background)]",
].join(" ");

// Image props
export type ImageProps = HTMLAttributes<HTMLDivElement> & {
  image: ProjectImage;
  title: string;
  animate?: AnimationTrigger;
  popDirection?: "out" | "in";
  rounded?: boolean;
  wrapperClassName?: string;
  faceClassName?: string;
};

// Main Image component
export default function Image({
  image,
  title,
  className,
  animate = false,
  popDirection = "out",
  rounded = false,
  wrapperClassName: wrapperClassNameProp,
  faceClassName,
  ...props
}: ImageProps) {
  // Animation trigger
  const { ref, shouldAnimate } = useAnimationTrigger<HTMLDivElement>(animate);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const failed = failedSrc === image.src;

  // Wrapper classes
  const wrapperClassName = twMerge(
    [
      // Layout and stacking
      "relative isolate block w-full",

      // Shadow
      "shadow-[var(--shadow)]",
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
      data-pop-direction={popDirection}
      {...props}
    >
      <div
        className={twMerge(
          imageStyles,
          shouldAnimate ? "border-none" : "border-border",
          shouldAnimate && "brutal-pop-face",
          rounded && "rounded-[var(--radius)]",
          faceClassName,
          className,
        )}
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
            rounded &&
              "absolute inset-0 overflow-hidden rounded-[var(--radius)]",
            failed && "sr-only",
          )}
        />

        {/* Border */}
        {shouldAnimate && (
          <DrawBorder
            animate
            radius={rounded ? "var(--radius)" : undefined}
            className="z-10"
          />
        )}
      </div>
    </div>
  );
}
