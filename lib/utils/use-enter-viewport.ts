import { useEffect, useRef, useState } from "react";

export type AnimationTrigger = boolean | "scroll";

/**
 * Watches an element until it first intersects the viewport, then stops.
 * Reduced motion never counts as entered, so a scroll animation is skipped
 * instead of flashing its start pose.
 */
export function useEnterViewport<T extends HTMLElement>(enabled: boolean) {
  const ref = useRef<T>(null);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    if (!enabled || hasEntered || !ref.current) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const element = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }

        setHasEntered(true);
        observer.unobserve(element);
      },
      { threshold: 0.1 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [enabled, hasEntered]);

  return { ref, hasEntered };
}

/** Maps the public animate prop onto the existing CSS pop classes. */
export function useAnimationTrigger<T extends HTMLElement>(
  animate: AnimationTrigger = false,
) {
  const scroll = animate === "scroll";
  const { ref, hasEntered } = useEnterViewport<T>(scroll);
  const shouldAnimate = animate === true || (scroll && hasEntered);

  return { ref, shouldAnimate };
}
