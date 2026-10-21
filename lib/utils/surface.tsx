/* eslint-disable react-refresh/only-export-components -- the provider and its hooks ship together */
import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { AnimationTrigger } from "./use-enter-viewport";

// Visual props a parent shares with the controls inside it.
// A child prop replaces the parent. An omitted child prop keeps the parent value.
export type Surface = {
  shadow?: boolean;
  border?: boolean;
  rounded?: boolean;
  animate?: AnimationTrigger;
};

const SurfaceContext = createContext<Surface>({});

export function SurfaceProvider({
  shadow,
  border,
  rounded,
  animate,
  children,
}: Surface & { children: ReactNode }) {
  const parent = useContext(SurfaceContext);
  const value = useMemo<Surface>(
    () => ({
      shadow: shadow ?? parent.shadow,
      border: border ?? parent.border,
      rounded: rounded ?? parent.rounded,
      animate: animate ?? parent.animate,
    }),
    [animate, border, parent, rounded, shadow],
  );

  return (
    <SurfaceContext.Provider value={value}>{children}</SurfaceContext.Provider>
  );
}

export function useSurface() {
  return useContext(SurfaceContext);
}

// Own prop, then the parent surface, then the control's own default.
export function useSurfaceFlag(
  own: boolean | undefined,
  key: "shadow" | "border" | "rounded",
  fallback: boolean,
) {
  const surface = useSurface();
  return own ?? surface[key] ?? fallback;
}

export function useSurfaceAnimate(own: AnimationTrigger | undefined) {
  const surface = useSurface();
  return own ?? surface.animate ?? false;
}
