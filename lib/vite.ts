import { themeBootScript, type ThemeBootOptions } from "./theme-boot.ts";

/*
 * Injects the theme boot script at the start of <head>.
 * The script is blocking, so the saved theme is set before the first paint.
 */
export function brutalReactUi(options?: ThemeBootOptions) {
  return {
    name: "brutal-react-ui",
    transformIndexHtml() {
      return [
        {
          tag: "script",
          injectTo: "head-prepend" as const,
          children: themeBootScript(options),
        },
      ];
    },
  };
}
