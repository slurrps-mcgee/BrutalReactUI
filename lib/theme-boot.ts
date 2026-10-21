export const themeStorageKey = "theme";

/* Same hex values as the light and dark --background tokens. */
export const themeBootColors = {
  light: "#cdf6fe",
  dark: "#0f2024",
} as const;

export type ThemeBootOptions = {
  storageKey?: string;
  colors?: Record<string, string>;
  lightThemes?: readonly string[];
};

/*
 * Inline script for index.html. It runs before paint and before React.
 * ThemeProvider clears the inline color once the stylesheet can take over.
 */
export function themeBootScript(options: ThemeBootOptions = {}): string {
  const storageKey = options.storageKey ?? themeStorageKey;
  const colors = { ...themeBootColors, ...options.colors };
  const lightThemes = options.lightThemes ?? ["light"];

  return `(function () {
  var key = ${JSON.stringify(storageKey)};
  var colors = ${JSON.stringify(colors)};
  var lightThemes = ${JSON.stringify([...lightThemes])};
  var theme = "light";
  try {
    var stored = localStorage.getItem(key);
    if (stored && stored !== "system") theme = stored;
    else if (window.matchMedia("(prefers-color-scheme: dark)").matches) theme = "dark";
  } catch (e) {}
  var root = document.documentElement;
  root.setAttribute("data-theme", theme);
  var background = colors[theme];
  if (!background) background = lightThemes.indexOf(theme) === -1 ? colors.dark : colors.light;
  root.style.colorScheme = lightThemes.indexOf(theme) === -1 ? "dark" : "light";
  root.style.background = background;
})();`;
}
