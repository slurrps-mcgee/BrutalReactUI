# Brutal React UI

React components with thick borders, hard shadows, and a palette stored in CSS variables. Tailwind CSS v4 turns those variables into utilities such as `bg-main`, `text-txt`, and `font-display`.

## Install

```bash
npm install brutal-react-ui react react-dom tailwindcss
```

`react`, `react-dom`, and `tailwindcss` are peer dependencies. Fonts, `class-variance-authority`, and `lucide-react` are installed with the package.

## Use the components

The stylesheet is the Tailwind entry. It loads Tailwind, the fonts, the palette, and the component animations. Point Tailwind at the package so classes used inside the components are generated. With the Vite plugin:

```ts
// vite.config.ts
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), react()],
});
```

```css
/* src/index.css */
@import "brutal-react-ui/styles.css";
```

`styles.css` already contains `@source` paths for the component files shipped in the package, so you do not add a separate `@source` for normal use.

Wrap the tree in `ThemeProvider`. It writes `data-theme` on `<html>` and remembers the choice in `localStorage` under the key `theme`.

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Button, ThemeProvider } from "brutal-react-ui";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <Button>Press</Button>
    </ThemeProvider>
  </StrictMode>,
);
```

`ThemeToggle` and `useTheme` must render under `ThemeProvider`.

### Button

| Prop           | Values                             | Default   |
| -------------- | ---------------------------------- | --------- |
| `variant`      | `primary`, `secondary`, `outline`  | `primary` |
| `size`         | `sm`, `md`, `lg`                   | `md`      |
| `fullWidth`    | `true`, `false`                    | `false`   |
| `animate`      | draws the border and plays the pop | `false`   |
| `popDirection` | `out`, `in`                        | `out`     |

Other props are passed to `<button>`. `type` defaults to `"button"`.

```tsx
<Button variant="secondary" size="lg" onClick={save}>
  Save
</Button>
```

### Badge

Same `variant`, `size`, `animate`, and `popDirection` props as `Button`. `size` defaults to `sm`. Props are passed to a `<span>`.

```tsx
<Badge variant="outline" size="md">
  Draft
</Badge>
```

### Input

| Prop               | Values                            | Default   |
| ------------------ | --------------------------------- | --------- |
| `variant`          | `primary`, `secondary`, `outline` | `primary` |
| `size`             | `sm`, `md`, `lg`                  | `md`      |
| `wrapperClassName` | classes for the shadow wrapper    | —         |

The native `size` attribute is omitted so it does not clash with the visual size. Every other `<input>` attribute works, including `value` and `onChange`.

```tsx
<label htmlFor="email">
  Email
  <Input id="email" type="email" placeholder="ada@example.com" />
</label>
```

### Image

`image` is `{ src, width?, height? }`. `title` is used in the alt text: `Screenshot of ${title}`. `animate` and `popDirection` match the other components.

```tsx
<Image
  title="Studio"
  image={{ src: "/studio.png", width: 1200, height: 675 }}
/>
```

### ProjectLink

`href` is required. `children` is a string, because the hover label is rendered twice. External `http` and `https` URLs open in a new tab with `rel="noopener noreferrer"`.

| Prop           | Values               | Default   |
| -------------- | -------------------- | --------- |
| `variant`      | `default`            | `default` |
| `size`         | `sm`, `md`, `lg`     | `md`      |
| `animate`      | adds the pop wrapper | `false`   |
| `popDirection` | `out`, `in`          | `out`     |

```tsx
<ProjectLink href="https://example.com">Demo</ProjectLink>
```

### ProjectCard

`data` is a `ProjectCardData` object:

```ts
{
  slug: string
  title: string
  subTitle: string
  description: string
  image: { src: string; width?: number; height?: number }
  chips: string[]
  demoURL?: string
  githubURL?: string
}
```

The card links to `/projects/${data.slug}`. `variant` is `primary`, `secondary`, or `outline` (default `primary`). `size` is `sm`, `md`, or `lg` (default `md`). `animate` and `popDirection` match the other components.

`Project` extends `ProjectCardData` with longer case-study fields (`overview`, `role`, `problem`, and the rest). A full `Project` can be passed as `data`.

```tsx
<ProjectCard
  data={{
    slug: "field-notes",
    title: "Field Notes",
    subTitle: "Case study",
    description: "Notes from the build.",
    image: { src: "/cover.png" },
    chips: ["React"],
    demoURL: "https://example.com",
  }}
/>
```

### ThemeToggle

Renders an icon button that switches between `light` and `dark`. It reads the current preference from `useTheme`.

```tsx
<ThemeToggle />
```

`useTheme()` returns `{ theme, setTheme, themes }`. `theme` is `'light'`, `'dark'`, `'system'`, or another name you have registered. `'system'` follows `prefers-color-scheme` and still sets `data-theme` to the resolved color theme.

## Theme engine

Color is not baked into the components. Components use Tailwind utilities (`bg-main`, `text-txt`, `border-border`, `font-mono`). Those utilities read CSS variables defined in `lib/styles/index.css`.

The chain is:

1. `:root` sets the raw palette: `--palette-bg`, `--palette-paper`, `--palette-main`, `--palette-text`, and the rest.
2. Semantic variables such as `--background` and `--main` point at the palette.
3. `@theme inline` exposes them to Tailwind as `--color-main`, `--font-display`, and so on.
4. `ThemeProvider` sets `data-theme` on `<html>`.
5. A `:root[data-theme='dark']` block replaces only the `--palette-*` values. Everything else follows.

`@custom-variant dark` matches `[data-theme='dark']`, so `dark:` utilities apply in the dark theme.

Fonts:

| Token          | Family         |
| -------------- | -------------- |
| `font-sans`    | Inter Variable |
| `font-display` | Space Grotesk  |
| `font-mono`    | IBM Plex Mono  |

IBM Plex Sans is loaded and available as `font-family: 'IBM Plex Sans'` if you want it in a theme.

### Add a theme in this repository

1. Copy the `:root[data-theme='dark']` block into `src/index.css`.
2. Change the attribute to your theme name and override `--palette-*` and `color-scheme`. Leave the semantic variables alone.
3. Add that name to `themeNames` in `lib/utils/theme-context.tsx`.

```css
/* src/index.css */
@import "../lib/styles/index.css";

:root[data-theme="ocean"] {
  color-scheme: dark;

  --palette-bg: #06283d;
  --palette-paper: #1363df;
  --palette-main: #47b5ff;
  --palette-main-text: #06283d;
  --palette-border: #000000;
  --palette-border-dark: #000000;
  --palette-text: #dff6ff;
  --palette-sub-text: #dff6ff;
  --palette-accent: #47b5ff;
  --palette-sky: #47b5ff;
  --palette-rose: #e879f9;
  --palette-secondary: #e879f9;
  --palette-muted: #0a4d8c;
  --palette-destructive: #ff5a5a;
  --palette-input: #0a4d8c;
  --palette-ring: #47b5ff;
  --palette-overlay: rgb(0 0 0 / 55%);
  --palette-sidebar: #041c2c;
  --palette-sidebar-accent: #0a4d8c;
}
```

```ts
// lib/utils/theme-context.tsx
export const themeNames = ["light", "dark", "ocean"] as const;
```

`setTheme('ocean')` then sets `data-theme="ocean"`. A stored theme name that is not in the active list falls back to `'system'`.

### Add a theme in an app that installs the package

Do the same in the app's CSS, after the library import. Pass the extra name to `ThemeProvider` instead of editing the package:

```tsx
<ThemeProvider themes={["light", "dark", "ocean"]}>
  <App />
</ThemeProvider>
```

`themes` replaces the built-in list for validation. Include `'light'` and `'dark'` when you still want those themes.

## Develop and publish

```bash
npm install
npm run dev
npm run build
npm publish
```

`npm run dev` starts the showcase in `src/`. `npm run build` typechecks `lib/` and writes `dist/index.js` (ESM), `dist/index.cjs` (CommonJS), and the `.d.ts` files. `prepublishOnly` runs that build before `npm publish`.

Published entry points:

| Import                       | File                   |
| ---------------------------- | ---------------------- |
| `brutal-react-ui` (ESM)      | `dist/index.js`        |
| `brutal-react-ui` (CommonJS) | `dist/index.cjs`       |
| `brutal-react-ui/styles.css` | `lib/styles/index.css` |
