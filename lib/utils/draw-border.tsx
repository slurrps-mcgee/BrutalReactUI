import { useLayoutEffect, useRef, useState } from "react";

type DrawBorderProps = {
  className?: string;
  animate?: boolean;
  strokeWidth?: number;
  radius?: string;
};

export default function DrawBorder({
  className = "",
  animate = false,
  strokeWidth = 3,
  radius,
}: DrawBorderProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const rectRef = useRef<SVGRectElement>(null);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const svg = svgRef.current;
    const rect = rectRef.current;
    if (!svg || !rect) {
      return;
    }

    const apply = () => {
      const length = rect.getTotalLength();
      if (length <= 0) {
        return;
      }

      rect.style.setProperty("--draw-length", `${length}px`);
      setReady(true);
    };

    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(svg);
    return () => observer.disconnect();
  }, [radius, strokeWidth]);

  const svgClasses = [
    // Sit over the face without taking clicks.
    "pointer-events-none absolute overflow-visible",

    // Start the dash only after the perimeter is known.
    animate && ready && "animate-drawBorder",

    // Stroke color follows the border token.
    "text-border",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Cover the border box, not the padding box. The face keeps its border
  // width (transparent while drawing) so the outer size matches the resting stroke.
  const inset = strokeWidth / 2;

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      className={svgClasses}
      preserveAspectRatio="none"
      style={{
        left: -strokeWidth,
        top: -strokeWidth,
        width: `calc(100% + ${strokeWidth * 2}px)`,
        height: `calc(100% + ${strokeWidth * 2}px)`,
      }}
    >
      <rect
        ref={rectRef}
        x={inset}
        y={inset}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin={radius ? "round" : "miter"}
        style={{
          width: `calc(100% - ${strokeWidth}px)`,
          height: `calc(100% - ${strokeWidth}px)`,
          rx: radius ? `max(0px, calc(${radius} - ${inset}px))` : undefined,
          ry: radius ? `max(0px, calc(${radius} - ${inset}px))` : undefined,
        }}
      />
    </svg>
  );
}
