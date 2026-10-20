# Brutal React UI

React components with thick borders, hard shadows, and a palette stored in CSS variables. Tailwind CSS v4 turns those variables into utilities such as `bg-main`, `text-foreground`, and `font-display`.

## Install

```bash
npm install brutal-react-ui
```

`react` and `react-dom` are peer dependencies and are already in the app. The fonts, `class-variance-authority`, `lucide-react`, `tailwind-merge`, `prism-react-renderer`, and `tw-animate-css` are installed with the package. The published stylesheet is already compiled, so the app does not install Tailwind or add a Vite plugin.

```css
/* src/styles/index.css, the file the app already loads */
@import "brutal-react-ui/styles.css";
```

Rules after that import replace the library colors. They win because they come later in the same file.

```css
@import "brutal-react-ui/styles.css";

/* Replace the default palette. */
:root {
  --main: #facc15;
  --background: #fffdeb;
}

/* Replace the dark palette. */
:root[data-theme="dark"] {
  --main: #facc15;
  --background: #111111;
}

/* Add a theme. Pass the name to ThemeProvider. */
:root[data-theme="ocean"] {
  color-scheme: dark;
  --background: #06283d;
  --main: #47b5ff;
  --main-foreground: #06283d;
  --foreground: #dff6ff;
  --border: #dff6ff;
}
```

An app that already runs Tailwind and writes its own utility classes still needs the Tailwind plugin. This compiled file does not include classes that exist only in that app.

## Use the components

Wrap the tree in `ThemeProvider`. It writes `data-theme` on `<html>` and remembers the choice in `localStorage` under the key `theme`.

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "brutal-react-ui";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
```

`ThemeToggle` and `useTheme` must render under `ThemeProvider`.

### Shared props

Many faces accept the same options:

| Prop      | Values                             | Default |
| --------- | ---------------------------------- | ------- |
| `variant` | `primary`, `secondary`, `outline`  | varies  |
| `size`    | `sm`, `md`, `lg`                   | `md`    |
| `rounded` | rounds the face and its shadow     | `false` |
| `animate` | `false`, `true`, or `"scroll"`     | `false` |
| `shadow`  | hard shadow, where the prop exists | varies  |

`animate` draws the border, then pops the face outward. Entrance animation does not pop inward. `true` plays on mount. `"scroll"` plays the first time the element enters the viewport. `className` lands on the face. `wrapperClassName`, where present, lands on the shadow wrapper.

Status colors used by alerts, badges, progress, and toasts are `success`, `warning`, `danger`, and `info`.

### Components

| Component       | Use                                                                                                                                                                    |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Accordion`     | Stacked panels. `type` is `"single"` or `"multiple"`. Single mode is collapsible. Parts: `AccordionItem`, `AccordionTrigger`, `AccordionContent`.                      |
| `Alert`         | Inline status. `dismissible` adds a close control. `timer` or `duration`, in milliseconds, fades it out. `0` keeps it open.                                            |
| `Badge`         | Small label. `animate` draws its border and does not add a shadow.                                                                                                     |
| `Breadcrumb`    | Trail of links. Parts: `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`.                                                  |
| `Button`        | Pressable face. `fullWidth` stretches it. `type` defaults to `"button"`. Pressing moves it into its shadow.                                                            |
| `ButtonGroup`   | Joined buttons with one shadow. `selectionMode` is `"none"`, `"single"`, or `"multiple"`, and defaults to `"none"`. `orientation` is `"horizontal"` or `"vertical"`.   |
| `Card`          | Surface that pops outward when `animate` is set. Hover moves it into its shadow. Parts: `CardHeader`, `CardBody`, `CardFooter`, `CardImage`.                           |
| `Carousel`      | Slide track. `loop`, `autoplay`, `controls`, `indicators`, and `swipe` are optional. Parts: `CarouselSlide`.                                                           |
| `Checkbox`      | Flat until checked, then it lifts with a short shadow.                                                                                                                 |
| `CodeSnippet`   | Highlighted source with a copy control. `code` and `language` are required. `showLanguage` defaults to `true`.                                                         |
| `Collapse`      | One panel. Control it with `open` and `onOpenChange`, or leave it uncontrolled. Parts: `CollapseTrigger`, `CollapseContent`.                                           |
| `Container`     | Titled section. `shadow` defaults to `false`. `fullWidth` stretches it.                                                                                                |
| `Dropdown`      | Menu whose border draws, then pops out. Parts: `DropdownToggle`, `DropdownMenu`, `DropdownItem`.                                                                       |
| `FloatingLabel` | Label that rises while the field is focused or filled. Pass one `Input`.                                                                                               |
| `Form`          | Validated form. `noValidate` is applied for you. Parts: `FormField`, `FormLabel`, `FormFeedback`. Invalid fields use the danger border and shadow.                     |
| `Image`         | Framed image. `image` is `{ src, width?, height? }`. `title` becomes `Screenshot of ${title}`.                                                                         |
| `Input`         | Field that sits in its shadow and lifts on focus. `valid` and `invalid` recolor the border. Invalid also recolors the shadow.                                          |
| `InputGroup`    | Joined prefix, field, and suffix. The group lifts on focus. Parts: `InputGroupText`.                                                                                   |
| `Link`          | Text link. `href` is required and `children` is a string. External `http` and `https` URLs open in a new tab.                                                          |
| `ListGroup`     | Stacked items with one border and shadow. Parts: `ListGroupItem`, `ListGroupButton`, `ListGroupLink`.                                                                  |
| `Modal`         | Dialog. `animate` draws the border, then reveals the face. Parts: `ModalHeader`, `ModalBody`, `ModalFooter`, `ModalClose`.                                             |
| `Nav`           | Link list for a bar or sidebar. Parts: `NavItem`, `NavLink`, `NavGroup`. `NavItem` and `NavLink` accept `rounded`.                                                     |
| `Navbar`        | Top bar. Parts: `NavbarBrand`, `NavbarCollapse`. Pair the collapse with `Toggler`.                                                                                     |
| `Pagination`    | Page links. Parts: `PaginationList`, `PaginationItem`, `PaginationLink`, `PaginationPrevious`, `PaginationNext`, `PaginationEllipsis`.                                 |
| `Progress`      | Bar. Omit `value` for an indeterminate state. `shadow` defaults to `false`.                                                                                            |
| `Radio`         | Round option. The shadow appears only while it is selected.                                                                                                            |
| `Range`         | Slider. `rounded` rounds the track and thumb. `showValue` prints the current value.                                                                                    |
| `Select`        | Listbox that pops open with its menu. Parts: `SelectOption`.                                                                                                           |
| `Sidebar`       | Column that scrolls once it reaches the viewport height. `collapsed` switches it to an icon rail. `Offcanvas` is the overlay panel.                                    |
| `Skeleton`      | Placeholder. `variant` is `text`, `circular`, or `rectangular`. `animation` is `pulse`, `wave`, or `none`.                                                             |
| `Spinner`       | Loading mark. `label` is announced to assistive technology.                                                                                                            |
| `Table`         | Data table. The shadow and animation live on `TableResponsive`, not on each cell. `bordered`, `striped`, `hoverable`, `compact`, and `stickyHeader` belong to `Table`. |
| `Toast`         | Notification. Wrap the app in `ToastProvider`, render `ToastViewport`, and call `useToast()`. `timer` or `duration` fades each toast.                                  |
| `Tooltip`       | Hover and focus hint. Parts: `TooltipTrigger`, `TooltipContent`.                                                                                                       |
| `Toggler`       | Menu button. `iconAnimation` is `normal`, `spin`, `rotate-clockwise`, `rotate-counterclockwise`, `arrow-left`, `arrow-right`, `arrow-up`, or `arrow-down`.             |
| `ThemeToggle`   | Switches between light and dark. It must render under `ThemeProvider`.                                                                                                 |

```tsx
<Button variant="secondary" size="lg" rounded animate="scroll">
  Save
</Button>
```

```tsx
<Card variant="outline" rounded>
  <CardHeader>Library</CardHeader>
  <CardBody>Thick borders and hard shadows.</CardBody>
</Card>
```

```tsx
<Link href="https://example.com">Demo</Link>
```

## Theme engine

Color is not baked into the components. Components use Tailwind utilities (`bg-main`, `text-foreground`, `border-border`, `font-mono`). Those utilities read CSS variables defined in `lib/styles/index.css`.

The chain is:

1. `:root` sets semantic variables such as `--background`, `--foreground`, `--main`, `--border`, `--success`, `--warning`, `--danger`, and `--info`.
2. `@theme inline` exposes them to Tailwind as `--color-main`, `--font-display`, and so on.
3. `ThemeProvider` sets `data-theme` on `<html>`.
4. A `:root[data-theme='dark']` block replaces the semantic colors. Components follow those variables.

`@custom-variant dark` matches `[data-theme='dark']`, so `dark:` utilities follow the dark theme.

Fonts:

| Token          | Family         |
| -------------- | -------------- |
| `font-sans`    | Inter Variable |
| `font-display` | Space Grotesk  |
| `font-mono`    | IBM Plex Mono  |

IBM Plex Sans is loaded and available as `font-family: "IBM Plex Sans"`.

`useTheme()` returns `{ theme, setTheme, themes }`. `theme` is `"light"`, `"dark"`, `"system"`, or another name you have registered. `"system"` follows `prefers-color-scheme` and still sets `data-theme` to the resolved color theme.

### Add a theme in an app

Put the `:root[data-theme="ocean"]` block after the library import, as in the install example, then pass the name to `ThemeProvider`:

```tsx
<ThemeProvider themes={["light", "dark", "ocean"]}>
  <App />
</ThemeProvider>
```

`themes` replaces the built-in list for validation. Include `"light"` and `"dark"` when you still want those themes. `setTheme("ocean")` sets `data-theme="ocean"`. A stored theme name that is not in the active list falls back to `"system"`.

## Develop and publish

```bash
npm install
npm run dev
npm run build
npm publish
```

`npm run dev` starts the showcase in `src/`. `npm run build` typechecks `lib/`, writes `dist/index.js` (ESM), `dist/index.cjs` (CommonJS), and the `.d.ts` files, then compiles `dist/styles.css`. `prepublishOnly` runs that build before `npm publish`.

Published entry points:

| Import                       | File              |
| ---------------------------- | ----------------- |
| `brutal-react-ui` (ESM)      | `dist/index.js`   |
| `brutal-react-ui` (CommonJS) | `dist/index.cjs`  |
| `brutal-react-ui/styles.css` | `dist/styles.css` |
