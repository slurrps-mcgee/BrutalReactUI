import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = resolve(root, "lib/styles/index.css");
const source = readFileSync(sourcePath, "utf8");
const fontImport = /^@import ["'](@fontsource[^"']+)["'];\n/gm;
const fontImports = [...source.matchAll(fontImport)].map((match) => match[1]);
const withoutFonts = source.replace(fontImport, "");
const inputPath = resolve(root, "lib/styles/.compile.css");
const distPath = resolve(root, "dist");
const utilitiesPath = resolve(distPath, "utilities.css");

mkdirSync(distPath, { recursive: true });
writeFileSync(inputPath, withoutFonts);

const compiled = spawnSync(
  "tailwindcss",
  ["-i", inputPath, "-o", utilitiesPath],
  { cwd: root, stdio: "inherit" },
);

rmSync(inputPath, { force: true });

if (compiled.status !== 0) {
  process.exit(compiled.status ?? 1);
}

const entry = [
  ...fontImports.map((specifier) => `@import "${specifier}";`),
  '@import "./utilities.css";',
  "",
].join("\n");

writeFileSync(resolve(distPath, "styles.css"), entry);
