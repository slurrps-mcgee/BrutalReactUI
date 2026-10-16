import { twMerge } from "tailwind-merge";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../utils/theme-context";
import Button from "./button";
import { useNavbarRounded } from "./navbar";

// ThemeToggle is a Button. Styles, shouldAnimate, and the shadow wrapper live there.
// Class props forward to that button. className stays on the face, last.

export default function ThemeToggle({
  rounded,
  className,
}: {
  rounded?: boolean;
  className?: string;
}) {
  const { theme, setTheme } = useTheme();
  const navbarRounded = useNavbarRounded();
  const isRounded = rounded ?? navbarRounded;
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
      rounded={isRounded}
      className={twMerge(
        [
          // Square icon button. Padding is cleared so the icon stays centered.
          "size-10 !px-0 !py-0",
          className,
        ]
          .filter(Boolean)
          .join(" "),
      )}
    >
      {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
    </Button>
  );
}
