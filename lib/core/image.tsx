import { useState, type HTMLAttributes } from "react";
import type { ProjectImage } from "../types/types";
import DrawBorder from "../utils/draw-border";
import {
  useAnimationTrigger,
  type AnimationTrigger,
} from "../utils/use-enter-viewport";

export type ImageProps = HTMLAttributes<HTMLDivElement> & {
  image: ProjectImage;
  title: string;
  animate?: AnimationTrigger;
  popDirection?: "out" | "in";
};

export default function Image({
  image,
  title,
  className,
  animate = false,
  popDirection = "out",
  ...props
}: ImageProps) {
  const { ref, shouldAnimate } = useAnimationTrigger<HTMLDivElement>(animate);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const failed = failedSrc === image.src;
  const imageShift =
    popDirection === "in"
      ? "translate-x-[var(--shadow-offset-x)] translate-y-[var(--shadow-offset-y)]"
      : "-translate-x-[var(--shadow-offset-x)] -translate-y-[var(--shadow-offset-y)]";

  const wrapperClasses = [
    // Layout and stacking
    "relative isolate block aspect-video w-full",

    // Border and shadow
    'before:pointer-events-none before:absolute before:inset-0 before:z-0 before:content-[""] border-none',
    "before:translate-x-[var(--shadow-offset-x)]",
    "before:translate-y-[var(--shadow-offset-y)]",
    "before:bg-[var(--shadow-color)]",

    // Theme
    shouldAnimate && "animate-brutal-pop",

    // Class name
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={wrapperClasses}
      data-pop-direction={popDirection}
      {...props}
      ref={ref}
    >
      <div
        className={[
          "brutal-pop-face brutal-image-face absolute inset-0 z-10 border-[3px] border-border bg-paper border-none",
          imageShift,
        ].join(" ")}
      >
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

        <DrawBorder animate={shouldAnimate} className="z-10" />
      </div>
    </div>
  );
}
