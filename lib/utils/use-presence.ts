/* eslint-disable react-hooks/set-state-in-effect -- presence intentionally derives staged mount and visibility state from open */
import { useEffect, useState } from "react";

export function usePresence(open: boolean, duration = 200) {
  const [present, setPresent] = useState(open);
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    if (open) {
      setPresent(true);
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    setVisible(false);
    const timer = window.setTimeout(() => setPresent(false), duration);
    return () => window.clearTimeout(timer);
  }, [duration, open]);

  return { present, visible };
}
