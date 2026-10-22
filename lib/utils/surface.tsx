/* eslint-disable react-refresh/only-export-components -- the provider and its hooks ship together */
import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { AnimationTrigger } from "./use-enter-viewport";

// Component props. border and shadow default to true. animate and rounded default to false.
// Parents pass rounded and disabled. A parent may also pass shadow, border, and animate.
// A child prop replaces the parent. An omitted value keeps a parent value when one was set.
export type SurfaceProps = {
  rounded?: boolean;
  border?: boolean;
  shadow?: boolean;
  animate?: AnimationTrigger;
  disabled?: boolean;
};

export type Surface = SurfaceProps;

// What a parent hands to its children.
// shadow, border, and animate are optional. Unset, the child keeps its own default.
type InheritedSurface = {
  rounded?: boolean;
  disabled?: boolean;
  border?: boolean;
  shadow?: boolean;
  animate?: AnimationTrigger;
};

const SurfaceContext = createContext<InheritedSurface>({});

export function SurfaceProvider({
  rounded,
  disabled,
  border,
  shadow,
  animate,
  children,
}: InheritedSurface & { children: ReactNode }) {
  const parent = useContext(SurfaceContext);
  const value = useMemo<InheritedSurface>(
    () => ({
      rounded: rounded ?? parent.rounded,
      disabled: disabled ?? parent.disabled,
      border: border ?? parent.border,
      shadow: shadow ?? parent.shadow,
      animate: animate ?? parent.animate,
    }),
    [animate, border, disabled, parent, rounded, shadow],
  );

  return (
    <SurfaceContext.Provider value={value}>{children}</SurfaceContext.Provider>
  );
}

export function useSurface() {
  return useContext(SurfaceContext);
}

// A child prop replaces the parent. An omitted prop keeps a parent value when one was set.
// border and shadow default to true. rounded defaults to false.
export function useSurfaceFlag(
  own: boolean | undefined,
  key: "shadow" | "border" | "rounded",
  fallback: boolean = key === "rounded" ? false : true,
) {
  const surface = useSurface();
  return own ?? surface[key] ?? fallback;
}

// animate defaults to false. An omitted prop keeps a parent value when one was set.
export function useSurfaceAnimate(own: AnimationTrigger | undefined) {
  const surface = useSurface();
  return own ?? surface.animate ?? false;
}

// An omitted child prop keeps the parent value. An explicit child value replaces it.
export function useSurfaceDisabled(own: boolean | undefined) {
  const surface = useSurface();
  return own ?? surface.disabled ?? false;
}

// Paint shared chrome only when the prop is true, so an omitted prop keeps the current face.
export function surfaceClasses({
  rounded,
  border,
  shadow,
  disabled,
}: Pick<SurfaceProps, "rounded" | "border" | "shadow" | "disabled">) {
  return [
    rounded ? "rounded-[var(--radius)]" : "",
    border ? "border-[length:var(--border-width)] border-border" : "",
    shadow ? "shadow-[var(--shadow)]" : "",
    disabled ? "pointer-events-none opacity-70" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

// Paint the resting stroke, or none when border is off.
export function borderPaintClass(border: boolean | undefined) {
  if (!border) return "border-none";
  return "border-[length:var(--border-width)] border-border";
}

// The face uses the outer radius.
export function faceRadiusClass(rounded: boolean | undefined) {
  if (!rounded) return "";
  return "rounded-[var(--radius)]";
}
