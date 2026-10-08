import { useEffect, useState, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, Clipboard } from "lucide-react";
import {
  Highlight,
  themes,
  type Language,
  type PrismTheme,
} from "prism-react-renderer";
import { twMerge } from "tailwind-merge";
import DrawBorder from "../utils/draw-border";
import {
  useAnimationTrigger,
  type AnimationTrigger,
} from "../utils/use-enter-viewport";
import { useToast } from "./toast";

// Code snippet styles
const codeSnippetStyles = cva(
  [
    // Layout and stacking
    "relative isolate w-full",

    // Border, shadow, and typography
    "border-[3px] border-border",
    "font-mono text-sm",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: "bg-main text-main-foreground",
        secondary: "bg-chart-2 text-main-foreground",
        success: "bg-success text-success-foreground",
        warning: "bg-warning text-warning-foreground",
        danger: "bg-danger text-danger-foreground",
        info: "bg-info text-info-foreground",
      },
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export type CodeSnippetVariant =
  "primary" | "secondary" | "success" | "warning" | "danger" | "info";

// Code snippet props
export type CodeSnippetProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof codeSnippetStyles> & {
    code: string;
    language: Language;
    theme?: PrismTheme;
    animate?: AnimationTrigger;
    copyLabel?: string;
    copiedLabel?: string;
    showLanguage?: boolean;
    rounded?: boolean;
    shadow?: boolean;
    wrapperClassName?: string;
  };

// Main CodeSnippet component
export default function CodeSnippet({
  className,
  code,
  language,
  theme = themes.oneDark,
  variant,
  size,
  animate = false,
  copyLabel = "Copy",
  copiedLabel = "Copied",
  showLanguage = true,
  rounded = false,
  shadow = true,
  wrapperClassName,
  ...props
}: CodeSnippetProps) {
  const [copied, setCopied] = useState(false);
  const { toast, available: hasToastProvider } = useToast();
  const { ref, shouldAnimate } = useAnimationTrigger<HTMLDivElement>(animate);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      if (hasToastProvider) {
        toast({
          variant: "success",
          title: copiedLabel,
          description: "Code copied to the clipboard.",
        });
      }
    } catch {
      setCopied(false);
      if (hasToastProvider) {
        toast({
          variant: "danger",
          title: "Copy failed",
          description: "Select the code and copy it manually.",
        });
      }
    }
  }

  return (
    <div
      ref={ref}
      className={twMerge(
        "relative isolate w-full",
        shadow && "shadow-[var(--shadow)]",
        rounded && "rounded-[var(--radius)]",
        shouldAnimate && "animate-brutal-pop",
        wrapperClassName,
      )}
      data-pop-direction="out"
    >
      <div
        className={twMerge(
          codeSnippetStyles({ variant, size }),
          shouldAnimate ? "brutal-pop-face border-none" : "border-border",
          rounded && "rounded-[var(--radius)]",
          className,
        )}
        {...props}
      >
        {shouldAnimate && (
          <DrawBorder
            animate
            strokeWidth={4}
            radius={rounded ? "var(--radius)" : undefined}
            className="z-20"
          />
        )}

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 border-b-[3px] border-border px-3 py-2">
          {showLanguage ? (
            <span className="truncate font-bold uppercase tracking-wide">
              {language}
            </span>
          ) : (
            <span />
          )}
          <button
            type="button"
            aria-label={copied ? copiedLabel : copyLabel}
            className={twMerge(
              [
                // Layout and typography
                "inline-flex shrink-0 items-center gap-2 border-[3px] border-border px-3 py-1.5",
                "bg-secondary-background font-mono text-xs font-bold uppercase text-foreground",

                // Interaction
                "transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5",
                "active:translate-x-0 active:translate-y-0",

                // Keyboard focus and reduced motion
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "motion-reduce:transition-none",
              ].join(" "),
            )}
            onClick={copyCode}
          >
            {copied ? (
              <Check aria-hidden="true" className="size-4" />
            ) : (
              <Clipboard aria-hidden="true" className="size-4" />
            )}
            <span>{copied ? copiedLabel : copyLabel}</span>
          </button>
        </div>

        {/* Highlighted source. The source is never trimmed or normalized. */}
        <Highlight theme={theme} code={code} language={language}>
          {({
            className: prismClassName,
            style,
            tokens,
            getLineProps,
            getTokenProps,
          }) => (
            <pre
              aria-label={`Copy ${language} code`}
              tabIndex={0}
              className={twMerge(
                prismClassName,
                "m-0 max-w-full cursor-copy overflow-auto bg-secondary-background p-4 text-left text-foreground",
                "[&_.token]:brightness-90 dark:[&_.token]:brightness-100",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
              )}
              style={{ ...style, backgroundColor: undefined }}
              onClick={copyCode}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  void copyCode();
                }
              }}
            >
              <code>
                {tokens.map((line, lineIndex) => {
                  const { key: _lineKey, ...lineProps } = getLineProps({
                    line,
                    key: lineIndex,
                  });
                  void _lineKey;

                  return (
                    <span key={lineIndex} {...lineProps}>
                      {line.map((token, tokenIndex) => {
                        const { key: _tokenKey, ...tokenProps } = getTokenProps(
                          {
                            token,
                            key: tokenIndex,
                          },
                        );
                        void _tokenKey;
                        return <span key={tokenIndex} {...tokenProps} />;
                      })}
                      {lineIndex < tokens.length - 1 ? "\n" : null}
                    </span>
                  );
                })}
              </code>
            </pre>
          )}
        </Highlight>

        {/* Local status remains available without ToastProvider. */}
        <span className="sr-only" role="status" aria-live="polite">
          {copied ? copiedLabel : ""}
        </span>
      </div>
    </div>
  );
}
