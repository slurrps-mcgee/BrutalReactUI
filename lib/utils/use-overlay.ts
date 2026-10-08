import { useEffect, type RefObject } from "react";

const focusable =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

export function useOverlay({
  open,
  contentRef,
  onClose,
  closeOnEscape = true,
}: {
  open: boolean;
  contentRef: RefObject<HTMLElement | null>;
  onClose: () => void;
  closeOnEscape?: boolean;
}) {
  useEffect(() => {
    if (!open) return;

    const previous = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    requestAnimationFrame(() => {
      const first = contentRef.current?.querySelector<HTMLElement>(focusable);
      (first ?? contentRef.current)?.focus();
    });

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && closeOnEscape) {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !contentRef.current) return;

      const items = [
        ...contentRef.current.querySelectorAll<HTMLElement>(focusable),
      ];
      if (!items.length) {
        event.preventDefault();
        contentRef.current.focus();
        return;
      }
      const first = items[0];
      const last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previous?.focus();
    };
  }, [closeOnEscape, contentRef, onClose, open]);
}
