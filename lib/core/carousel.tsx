import {
  Children,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type TouchEvent,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { ChevronLeft, ChevronRight } from "lucide-react";

const carouselStyles = cva(
  [
    "relative isolate w-full border-[3px] border-border",
    "bg-[var(--surface)] text-[var(--surface-foreground)]",
    "shadow-[var(--shadow)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    "focus-visible:ring-offset-2",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "bg-main text-main-foreground [--carousel-accent:var(--chart-2)]",
        secondary:
          "bg-chart-2 text-main-foreground [--carousel-accent:var(--main)]",
        outline:
          "bg-[var(--surface)] text-[var(--surface-foreground)] [--carousel-accent:var(--main)]",
      },
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "md",
    },
  },
);

const controlStyles = cva(
  [
    "absolute top-1/2 z-20 inline-flex -translate-y-1/2 items-center justify-center",
    "border-[3px] border-border bg-[var(--carousel-accent)] text-main-foreground",
    "shadow-[var(--shadow)] transition-transform duration-150",
    "hover:translate-x-[var(--shadow-offset-x)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    "disabled:pointer-events-none disabled:bg-disabled disabled:text-disabled-foreground",
    "disabled:shadow-none motion-reduce:transition-none",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "size-9",
        md: "size-11",
        lg: "size-14",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

function clampIndex(index: number, count: number, loop: boolean) {
  if (count <= 0) return 0;
  if (loop) return ((index % count) + count) % count;
  return Math.min(count - 1, Math.max(0, index));
}

export type CarouselProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange"> &
  VariantProps<typeof carouselStyles> & {
    children: ReactNode;
    index?: number;
    defaultIndex?: number;
    onIndexChange?: (index: number) => void;
    loop?: boolean;
    controls?: boolean;
    indicators?: boolean;
    autoplay?: boolean;
    autoplayInterval?: number;
    pauseOnHover?: boolean;
    pauseOnFocus?: boolean;
    swipe?: boolean;
    rounded?: boolean;
    label?: string;
    viewportClassName?: string;
    trackClassName?: string;
  };

export default function Carousel({
  children,
  index,
  defaultIndex = 0,
  onIndexChange,
  loop = true,
  controls = true,
  indicators = true,
  autoplay = false,
  autoplayInterval = 5000,
  pauseOnHover = true,
  pauseOnFocus = true,
  swipe = true,
  rounded = false,
  label = "Carousel",
  className,
  viewportClassName,
  trackClassName,
  variant,
  size,
  onKeyDown,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  onTouchStart,
  onTouchEnd,
  ...props
}: CarouselProps) {
  const slides = Children.toArray(children);
  const count = slides.length;
  const [uncontrolledIndex, setUncontrolledIndex] = useState(defaultIndex);
  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const reducedMotion = useReducedMotion();
  const currentIndex = clampIndex(index ?? uncontrolledIndex, count, loop);
  const paused =
    reducedMotion || (pauseOnHover && hovered) || (pauseOnFocus && focusWithin);

  function goTo(nextIndex: number) {
    if (count === 0) return;
    const next = clampIndex(nextIndex, count, loop);
    if (index === undefined) setUncontrolledIndex(next);
    if (next !== currentIndex) onIndexChange?.(next);
  }

  function previous() {
    goTo(currentIndex - 1);
  }

  function next() {
    goTo(currentIndex + 1);
  }

  useEffect(() => {
    if (!autoplay || paused || count < 2) return;
    const delay = Math.max(1000, autoplayInterval);
    const interval = window.setInterval(() => {
      const nextIndex = clampIndex(currentIndex + 1, count, loop);
      if (nextIndex === currentIndex) return;
      if (index === undefined) setUncontrolledIndex(nextIndex);
      onIndexChange?.(nextIndex);
    }, delay);
    return () => window.clearInterval(interval);
  }, [
    autoplay,
    autoplayInterval,
    count,
    currentIndex,
    index,
    loop,
    onIndexChange,
    paused,
  ]);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const target = event.target as HTMLElement;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      previous();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      next();
    } else if (event.key === "Home") {
      event.preventDefault();
      goTo(0);
    } else if (event.key === "End") {
      event.preventDefault();
      goTo(count - 1);
    }
  }

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    onTouchStart?.(event);
    if (!event.defaultPrevented && swipe) {
      touchStartX.current = event.touches[0]?.clientX ?? null;
    }
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    onTouchEnd?.(event);
    const start = touchStartX.current;
    touchStartX.current = null;
    if (event.defaultPrevented || !swipe || start === null) return;
    const end = event.changedTouches[0]?.clientX;
    if (end === undefined || Math.abs(start - end) < 40) return;
    if (start > end) next();
    else previous();
  }

  const previousDisabled = !loop && currentIndex === 0;
  const nextDisabled = !loop && currentIndex === count - 1;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      className={twMerge(
        carouselStyles({ variant, size }),
        rounded && "rounded-[var(--radius)]",
        className,
      )}
      onKeyDown={handleKeyDown}
      onMouseEnter={(event) => {
        onMouseEnter?.(event);
        if (!event.defaultPrevented) setHovered(true);
      }}
      onMouseLeave={(event) => {
        onMouseLeave?.(event);
        setHovered(false);
      }}
      onFocus={(event) => {
        onFocus?.(event);
        if (!event.defaultPrevented) setFocusWithin(true);
      }}
      onBlur={(event) => {
        onBlur?.(event);
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setFocusWithin(false);
        }
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      {...props}
    >
      <div
        className={twMerge(
          "overflow-hidden",
          rounded && "rounded-[calc(var(--radius)-3px)]",
          viewportClassName,
        )}
        aria-live={autoplay && !paused ? "off" : "polite"}
      >
        <div
          className={twMerge(
            "flex transition-transform duration-500 ease-out motion-reduce:transition-none",
            trackClassName,
          )}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, slideIndex) => (
            <div
              key={slideIndex}
              role="group"
              aria-roledescription="slide"
              aria-label={`${slideIndex + 1} of ${count}`}
              aria-hidden={slideIndex !== currentIndex}
              inert={slideIndex !== currentIndex ? true : undefined}
              className="w-full shrink-0"
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      {controls && count > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            disabled={previousDisabled}
            className={twMerge(
              controlStyles({ size }),
              "left-3 hover:translate-y-[calc(-50%+var(--shadow-offset-y))]",
              rounded && "rounded-[var(--radius)]",
            )}
            onClick={previous}
          >
            <ChevronLeft aria-hidden="true" className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            disabled={nextDisabled}
            className={twMerge(
              controlStyles({ size }),
              "right-3 hover:translate-y-[calc(-50%+var(--shadow-offset-y))]",
              rounded && "rounded-[var(--radius)]",
            )}
            onClick={next}
          >
            <ChevronRight aria-hidden="true" className="size-5" />
          </button>
        </>
      )}

      {indicators && count > 1 && (
        <div
          role="group"
          aria-label="Choose slide"
          className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2"
        >
          {slides.map((_, slideIndex) => (
            <button
              key={slideIndex}
              type="button"
              aria-label={`Go to slide ${slideIndex + 1}`}
              aria-current={slideIndex === currentIndex ? "true" : undefined}
              className={twMerge(
                "size-3 border-2 border-border bg-secondary-background",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                slideIndex === currentIndex && "bg-[var(--carousel-accent)]",
                rounded && "rounded-full",
              )}
              onClick={() => goTo(slideIndex)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export type CarouselSlideProps = HTMLAttributes<HTMLDivElement>;

export function CarouselSlide({ className, ...props }: CarouselSlideProps) {
  return <div className={twMerge("h-full w-full", className)} {...props} />;
}
