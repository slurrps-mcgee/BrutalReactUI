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

  const gutter = 1;
  const inset = strokeWidth / 2 + gutter;
  const box = strokeWidth + gutter * 2;

  return (
    <svg
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
        x={inset}
        y={inset}
        pathLength="100"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="miter"
        style={{
          width: `calc(100% - ${box}px)`,
          height: `calc(100% - ${box}px)`,
        }}
      />
    </svg>
  );
}
