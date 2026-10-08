import { useEffect, type RefObject } from "react";

export function useDismissableLayer<T extends HTMLElement>({
  ref,
  enabled = true,
  onDismiss,
}: {
  ref: RefObject<T | null>;
  enabled?: boolean;
  onDismiss: () => void;
}) {
  useEffect(() => {
    if (!enabled) return;

    function onPointerDown(event: PointerEvent) {
      if (!ref.current?.contains(event.target as Node)) onDismiss();
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onDismiss();
    }

    function onFocusIn(event: FocusEvent) {
      if (!ref.current?.contains(event.target as Node)) onDismiss();
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("focusin", onFocusIn);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("focusin", onFocusIn);
    };
  }, [enabled, onDismiss, ref]);
}
