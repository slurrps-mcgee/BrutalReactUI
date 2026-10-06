import { Moon, Sun } from "lucide-react";
import { useTheme } from "../utils/theme-context";
import Button from "./button";

// ThemeToggle is a Button. Styles, shouldAnimate, and the shadow wrapper live there.
// className stays on the button face.

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const handleThemeChange = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <Button
      variant="outline"
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      aria-pressed={isDark}
      onClick={handleThemeChange}
      className="size-10 !px-0 !py-0"
    >
      {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
    </Button>
  );
}
