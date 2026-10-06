import { Moon, Sun } from "lucide-react";
import { useTheme } from "../utils/theme-context";
import Button from "./button";

export default function ThemeToggle() {
  // Access the current theme and the function to update it
  const { theme, setTheme } = useTheme();

  // Determine if dark mode is active (handles explicit 'dark' or 'system' matching dark)
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const handleThemeChange = () => {
    // If it's dark, switch to light. If it's light, switch to dark.
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

//Will extend this to handle other themes in future
