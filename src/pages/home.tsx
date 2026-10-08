import { CodeSnippet, Container, useTheme } from "../../lib/main";
import { OutlineSet, outlineSetCode } from "./shared";

export default function HomePage() {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <p className="font-mono text-xs font-bold uppercase tracking-wide">
          Component library
        </p>
        <h1 className="font-display text-4xl font-bold sm:text-5xl">
          Brutal React UI
        </h1>
        <p className="max-w-xl font-sans text-base">
          Buttons, badges, fields, links, images, and cards on the shared
          palette. Active theme:{" "}
          <span className="font-mono font-bold">{theme}</span>.
        </p>
      </header>

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
          fullWidth
          animate="scroll"
          shadow
          rounded
        >
          <OutlineSet />
        </Container>
        <Container
          title="Secondary parent"
          variant="secondary"
          fullWidth
          animate="scroll"
          rounded
        >
          <OutlineSet />
        </Container>
      </section>
    </div>
  );
}
