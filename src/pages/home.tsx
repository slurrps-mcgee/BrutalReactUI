import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CodeSnippet,
  Container,
  Link,
  useTheme,
} from "../../lib/main";
import { OutlineSet } from "./shared";

const outlineSetCode = `import { Button, Input } from "brutal-react-ui";

<Button variant="outline">Outline</Button>
<Input variant="outline" placeholder="Outline" />`;

const installCommand = `npm install brutal-react-ui`;

const cssImport = `/* src/styles/index.css, the file the app already loads */
@import "brutal-react-ui/styles.css";`;

const usageCode = `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "brutal-react-ui";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);`;

export default function HomePage() {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <p className="font-mono text-xs font-bold uppercase tracking-wide">
          Component library
        </p>
        <h1 className="font-display text-4xl font-bold sm:text-5xl">
          Brutal React UI
        </h1>
        <p className="max-w-2xl font-sans text-base">
          A React component library. Each face has a thick border and a hard
          offset shadow. Color lives in CSS variables, so swapping the theme
          recolors every component. Active theme:{" "}
          <span className="font-mono font-bold">{theme}</span>.
        </p>
        <Link href="https://github.com/slurrps-mcgee/BrutalReactUI">
          GitHub
        </Link>
      </header>

      <section className="flex max-w-3xl flex-col gap-4">
        <h2 className="font-display text-2xl font-bold">Install</h2>
        <p className="font-sans">
          <span className="font-mono">react</span> and{" "}
          <span className="font-mono">react-dom</span> are already in the app.
          They stay peer dependencies. Rules after the import, in that same
          file, replace the library colors. See{" "}
          <Link href="#/colors" data-docs-link="">
            Colors
          </Link>{" "}
          and{" "}
          <Link href="#/themes" data-docs-link="">
            Themes
          </Link>
          .
        </p>
        <CodeSnippet language="bash" code={installCommand} />
        <CodeSnippet language="css" code={cssImport} />
      </section>

      <section className="flex max-w-3xl flex-col gap-4">
        <h2 className="font-display text-2xl font-bold">Use it</h2>
        <p className="font-sans">
          Wrap the tree in <span className="font-mono">ThemeProvider</span>. It
          writes <span className="font-mono">data-theme</span> on the document
          and remembers the choice. Import the components you render.
        </p>
        <div className="flex flex-col gap-4 border-[3px] border-border bg-[var(--surface)] p-5">
          <div className="flex flex-wrap items-center gap-4">
            <Button>Press</Button>
          </div>
          <Card wrapperClassName="max-w-sm">
            <CardHeader className="font-display text-xl font-bold">
              Library
            </CardHeader>
            <CardBody>Thick borders and hard shadows.</CardBody>
          </Card>
        </div>
        <CodeSnippet language="tsx" code={usageCode} />
      </section>

      <section className="flex max-w-2xl flex-col gap-4">
        <h2 className="font-display text-2xl font-bold">The library</h2>
        <p className="font-sans">
          Each component paints with Tailwind utilities such as{" "}
          <span className="font-mono">bg-main</span>,{" "}
          <span className="font-mono">border-border</span>, and{" "}
          <span className="font-mono">font-mono</span>. Those utilities read CSS
          variables, so a theme swap recolors every face without rewriting the
          components. Light and dark ship with the package. A new theme is
          another block of the same variable names.
        </p>
        <p className="font-sans">
          Faces that cast a shadow keep it on a wrapper.{" "}
          <span className="font-mono">className</span> lands on the face.{" "}
          <span className="font-mono">wrapperClassName</span> lands on the
          shadow, which is where a width cap belongs.{" "}
          <span className="font-mono">faceClassName</span> is an extra hook on
          the bordered face.{" "}
          <span className="font-mono">{"shadow={false}"}</span> removes the
          offset and any press or pop that only exists to sit on it.{" "}
          <span className="font-mono">{"border={false}"}</span> removes the
          stroke. <span className="font-mono">animate</span> pops the face on
          mount, or the first time it enters the viewport when the value is{" "}
          <span className="font-mono">"scroll"</span>.
        </p>
        <p className="font-sans">
          <span className="font-mono">variant</span> is usually primary,
          secondary, or outline. Status components also use success, warning,
          danger, and info. <span className="font-mono">size</span> is sm, md,
          or lg, and md keeps the current look.{" "}
          <span className="font-mono">rounded</span> uses the library radius.
          Each component page lists that component's props in alphabetical order
          and shows a live example next to the code that renders it.
        </p>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="font-display text-2xl font-bold">Surface</h2>
        <p className="max-w-2xl font-sans">
          Outline faces paint <span className="font-mono">--surface</span> and
          use the parent text color. An outline button on a main parent uses the
          secondary fill. The page falls back to the background color.
        </p>
        <div className="flex flex-col gap-4">
          <h3 className="font-display text-xl font-bold">Page</h3>
          <OutlineSet />
          <CodeSnippet language="tsx" code={outlineSetCode} />
        </div>
        <Container
          title="Primary parent"
          fluid
          animate="scroll"
          shadow
          rounded
        >
          <OutlineSet />
        </Container>
        <Container
          title="Secondary parent"
          variant="secondary"
          fluid
          animate="scroll"
          rounded
        >
          <OutlineSet />
        </Container>
      </section>
    </div>
  );
}
