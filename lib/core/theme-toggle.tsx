import { twMerge } from "tailwind-merge";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../utils/theme-context";
import type { AnimationTrigger } from "../utils/use-enter-viewport";
import Button from "./button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "./dropdown";
import { useSurfaceAnimate, useSurfaceFlag } from "../utils/surface";

// ThemeToggle is a button for light and dark. Extra theme names use a dropdown.
// animate draws that control. align places the menu. Class props land on the face.

export type ThemeToggleProps = {
  rounded?: boolean;
  shadow?: boolean;
  border?: boolean;
  className?: string;
  animate?: AnimationTrigger;
  align?: "left" | "right";
};

function themeLabel(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export default function ThemeToggle({
  rounded,
  shadow,
  border,
  className,
  animate: animateProp,
  align = "left",
}: ThemeToggleProps) {
  const { theme, setTheme, themes } = useTheme();
  const animate = useSurfaceAnimate(animateProp);
  const isRounded = useSurfaceFlag(rounded, "rounded", false);
  const showShadow = useSurfaceFlag(shadow, "shadow", true);
  const showBorder = useSurfaceFlag(border, "border", true);
  const menu = themes.some((name) => name !== "light" && name !== "dark");
  const resolved =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;
  const isDark = resolved !== "light";
  const icon = isDark ? (
    <Moon className="size-4" />
  ) : (
    <Sun className="size-4" />
  );
  const faceClassName = twMerge(
    [
      // Square icon button. Padding is cleared so the icon stays centered.
      "size-10 !px-0 !py-0",
      className,
    ]
      .filter(Boolean)
      .join(" "),
  );

  if (menu) {
    return (
      <Dropdown
        animate={animate}
        rounded={isRounded}
        shadow={showShadow}
        border={showBorder}
        className="w-auto"
      >
        <DropdownToggle
          variant="outline"
          aria-label="Choose theme"
          className={twMerge("w-auto", className)}
        >
          {themeLabel(theme)}
        </DropdownToggle>
        <DropdownMenu align={align}>
          {themes.map((name) => (
            <DropdownItem
              key={name}
              active={theme === name}
              onClick={() => setTheme(name)}
            >
              {themeLabel(name)}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    );
  }

  return (
    <Button
      variant="outline"
      animate={animate}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      aria-pressed={isDark}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      rounded={isRounded}
      shadow={showShadow}
      border={showBorder}
      className={faceClassName}
    >
      {icon}
    </Button>
  );
}
