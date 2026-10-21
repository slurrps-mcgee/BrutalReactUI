import { defineConfig } from "vite";
import { resolve } from "path";

/* Second build so the plugin file inlines the boot script instead of sharing a chunk with the component bundle. */
export default defineConfig({
  build: {
    emptyOutDir: false,
    copyPublicDir: false,
    minify: false,
    lib: {
      entry: resolve(import.meta.dirname, "lib/vite.ts"),
      formats: ["es", "cjs"],
      fileName: (format) => `vite.${format === "es" ? "js" : "cjs"}`,
    },
  },
});
