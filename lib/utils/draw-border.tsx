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
  }, [radius]);

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

  const gutter = 1;
  const inset = strokeWidth / 2 + gutter;
  const box = strokeWidth + gutter * 2;

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      className={svgClasses}
      preserveAspectRatio="none"
      style={{
        left: -inset,
        top: -inset,
        width: `calc(100% + ${box}px)`,
        height: `calc(100% + ${box}px)`,
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
          width: `calc(100% - ${box}px)`,
          height: `calc(100% - ${box}px)`,
          rx: radius,
          ry: radius,
        }}
      />
    </svg>
  );
}
