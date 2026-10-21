import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import dts from "vite-plugin-dts";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "path";
import { brutalReactUi } from "./lib/vite.ts";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    brutalReactUi({ colors: { ocean: "#06283d" } }),
    dts({
      insertTypesEntry: true,
      include: ["lib"],
      tsconfigPath: "./tsconfig.app.json",
      entryRoot: "lib",
    }),
    {
      name: "theme-boot-types",
      apply: "build",
      closeBundle() {
        const file = resolve(import.meta.dirname, "dist/vite.d.ts");
        const text = readFileSync(file, "utf8").replaceAll(
          "./theme-boot.ts",
          "./theme-boot",
        );
        writeFileSync(file, text);
      },
    },
  ],
  build: {
    copyPublicDir: false,
    minify: false,
    lib: {
      entry: resolve(import.meta.dirname, "lib/main.ts"),
      name: "BrutalReactUI",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "js" : "cjs"}`,
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "lucide-react",
        "class-variance-authority",
        "tailwind-merge",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
