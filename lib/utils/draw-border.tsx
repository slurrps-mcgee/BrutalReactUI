type DrawBorderProps = {
  className?: string;
  animate?: boolean;
  strokeWidth?: number;
};

export default function DrawBorder({
  className = "",
  animate = false,
  strokeWidth = 3,
}: DrawBorderProps) {
  const svgClasses = [
    "pointer-events-none absolute overflow-visible",
    animate && "animate-drawBorder",
    "text-border",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const half = strokeWidth / 2;

  return (
    <svg
      aria-hidden="true"
      className={svgClasses}
      preserveAspectRatio="none"
      shapeRendering="crispEdges"
      style={{
        left: -strokeWidth,
        top: -strokeWidth,
        width: `calc(100% + ${strokeWidth * 2}px)`,
        height: `calc(100% + ${strokeWidth * 2}px)`,
      }}
    >
      <rect
        x={half}
        y={half}
        pathLength="100"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        style={{
          width: `calc(100% - ${strokeWidth}px)`,
          height: `calc(100% - ${strokeWidth}px)`,
        }}
      />
    </svg>
  );
}
