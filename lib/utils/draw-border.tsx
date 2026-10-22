import { useLayoutEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

type DrawBorderProps = {
  className?: string;
  animate?: boolean;
  strokeWidth?: number;
  radius?: string;
};

function readBorderWidth(element: Element) {
  const raw = getComputedStyle(element).getPropertyValue("--border-width");
  const next = Number.parseFloat(raw);
  return Number.isFinite(next) && next > 0 ? next : 3;
}

export default function DrawBorder({
  className = "",
  animate = false,
  strokeWidth: strokeWidthProp,
  radius,
}: DrawBorderProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const rectRef = useRef<SVGRectElement>(null);
  const [ready, setReady] = useState(false);
  const [tokenWidth, setTokenWidth] = useState(strokeWidthProp ?? 3);
  const strokeWidth = strokeWidthProp ?? tokenWidth;

  useLayoutEffect(() => {
    const svg = svgRef.current;
    const rect = rectRef.current;
    if (!svg || !rect) {
      return;
    }

    const apply = () => {
      const width = strokeWidthProp ?? readBorderWidth(svg);
      if (strokeWidthProp == null) {
        setTokenWidth((current) => (current === width ? current : width));
      }

      const host = svg.parentElement;
      if (!host || host.clientWidth <= 0 || host.clientHeight <= 0) {
        return;
      }

      // The svg is padded outside the face so the stroke is not clipped at the
      // viewport. The centerline sits a hair outside the face edge and the
      // stroke is that much thicker, so the inner edge stays at half the token
      // and the antialiased outer pixel lands on the shadow instead of the face.
      const pad = width;
      const overhang = 0.5;
      const stroke = width + overhang;
      const center = -overhang / 2;
      const faceWidth = host.clientWidth;
      const faceHeight = host.clientHeight;
      const radiusPx =
        Number.parseFloat(getComputedStyle(host).borderTopLeftRadius) || 0;
      // Outer edge follows the face corner, plus the overhang.
      const curve = radius ? Math.max(0, radiusPx + overhang - stroke / 2) : 0;

      rect.setAttribute("x", String(pad + center));
      rect.setAttribute("y", String(pad + center));
      rect.setAttribute("width", String(Math.max(0, faceWidth - center * 2)));
      rect.setAttribute("height", String(Math.max(0, faceHeight - center * 2)));
      rect.setAttribute("stroke-width", String(stroke));
      if (curve > 0) {
        rect.setAttribute("rx", String(curve));
        rect.setAttribute("ry", String(curve));
        rect.setAttribute("stroke-linejoin", "round");
      } else {
        rect.removeAttribute("rx");
        rect.removeAttribute("ry");
        rect.setAttribute("stroke-linejoin", "miter");
      }

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
    if (svg.parentElement) observer.observe(svg.parentElement);
    return () => observer.disconnect();
  }, [radius, strokeWidth, strokeWidthProp]);

  const svgClasses = twMerge(
    // Sit over the face without taking clicks. Stroke color follows the border token.
    "pointer-events-none absolute overflow-visible text-border",

    // Start the dash only after the perimeter is known.
    animate && ready && "animate-drawBorder",
    className,
  );

  const pad = strokeWidth;

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      className={svgClasses}
      style={{
        left: -pad,
        top: -pad,
        width: `calc(100% + ${pad * 2}px)`,
        height: `calc(100% + ${pad * 2}px)`,
      }}
    >
      <rect ref={rectRef} fill="none" stroke="currentColor" />
    </svg>
  );
}
