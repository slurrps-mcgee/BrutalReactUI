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
  "border-[3px] border-border bg-paper border-none",
].join(" ");

// Image props
export type ImageProps = HTMLAttributes<HTMLDivElement> & {
  image: ProjectImage;
  title: string;
  animate?: AnimationTrigger;
  popDirection?: "out" | "in";
};

// Main Image component
export default function Image({
  image,
  title,
  className,
  animate = false,
  popDirection = "out",
  ...props
}: ImageProps) {
  // Animation trigger
  const { ref, shouldAnimate } = useAnimationTrigger<HTMLDivElement>(animate);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const failed = failedSrc === image.src;

  // Wrapper classes
  const wrapperClasses = [
    // Layout and stacking
    "relative isolate block w-full",

    // Shadow
    'before:pointer-events-none before:absolute before:inset-0 before:z-0 before:content-[""]',
    "before:translate-x-[var(--shadow-offset-x)]",
    "before:translate-y-[var(--shadow-offset-y)]",
    "before:bg-[var(--shadow-color)]",

    // Animation
    shouldAnimate && "animate-brutal-pop",
  ]
    .filter(Boolean)
    .join(" ");

  // Main return
  return (
    <div
      ref={ref}
      className={wrapperClasses}
      data-pop-direction={popDirection}
      {...props}
    >
      <div
        className={twMerge(
          imageStyles,
          shouldAnimate && "brutal-pop-face",
          className,
        )}
      >
        {/* Image */}
        <img
          src={image.src}
          alt={`Screenshot of ${title}`}
          width={image.width}
          height={image.height}
          loading="lazy"
          decoding="async"
          onError={() => setFailedSrc(image.src)}
          className={["block h-full w-full object-cover", failed && "sr-only"]
            .filter(Boolean)
            .join(" ")}
        />

        {/* Border */}
        <DrawBorder animate={shouldAnimate} className="z-10" />
      </div>
    </div>
  );
}
