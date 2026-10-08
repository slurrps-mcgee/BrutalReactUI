import { useCallback, useState } from "react";

export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const controlled = value !== undefined;
  const state = controlled ? value : uncontrolled;

  const setState = useCallback(
    (next: T | ((previous: T) => T)) => {
      const resolved =
        typeof next === "function" ? (next as (previous: T) => T)(state) : next;
      if (!controlled) setUncontrolled(resolved);
      onChange?.(resolved);
    },
    [controlled, onChange, state],
  );

  return [state, setState] as const;
}
