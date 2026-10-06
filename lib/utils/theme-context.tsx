/* Theme names and the hook are part of this module. */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";

/*
 * Built-in themes. Add a name here when you add a matching
 * :root[data-theme='name'] block in src/index.css (or lib/styles/index.css).
 */
export const themeNames = ["light", "dark"] as const;

export type ColorTheme = (typeof themeNames)[number];

export type ThemePreference = ColorTheme | "system" | (string & {});

const STORAGE_KEY = "theme";

interface ThemeContextType {
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
  themes: readonly string[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function readStoredTheme(themes: readonly string[]): ThemePreference {
  if (typeof window === "undefined") {
    return "system";
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "system" || (stored !== null && themes.includes(stored))) {
    return stored;
  }

  return "system";
}

function resolveColorTheme(preference: string): string {
  if (preference !== "system") {
    return preference;
  }

  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({
  children,
  themes = themeNames,
}: {
  children: React.ReactNode;
  themes?: readonly string[];
}) {
  const [theme, setTheme] = useState<ThemePreference>(() =>
    readStoredTheme(themes),
  );
  const activeTheme: ThemePreference =
    theme !== "system" && !themes.includes(theme) ? "system" : theme;

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      root.setAttribute("data-theme", resolveColorTheme(activeTheme));
    };

    applyTheme();
    localStorage.setItem(STORAGE_KEY, activeTheme);

    const handleSystemChange = () => {
      if (activeTheme === "system") applyTheme();
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, [activeTheme]);

  return (
    <ThemeContext.Provider value={{ theme: activeTheme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
