import { useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CodeSnippet,
  Container,
} from "../../lib/main";

const tokens = [
  "--background",
  "--secondary-background",
  "--foreground",
  "--main",
  "--main-foreground",
  "--border",
  "--ring",
  "--overlay",
  "--disabled",
  "--disabled-foreground",
  "--success",
  "--success-foreground",
  "--warning",
  "--warning-foreground",
  "--danger",
  "--danger-foreground",
  "--info",
  "--info-foreground",
  "--chart-1",
  "--chart-2",
  "--chart-3",
  "--chart-4",
  "--chart-5",
] as const;

const defaultOverride = `@import "brutal-react-ui/styles.css";

:root {
  --main: #facc15;
  --background: #fffdeb;
  --main-foreground: #000000;
  --foreground: #000000;
  --border: #000000;
}`;

const darkOverride = `:root[data-theme="dark"] {
  --main: #facc15;
  --background: #111111;
  --foreground: #fffdeb;
  --border: #fffdeb;
}`;

function channel(value: number) {
  const scaled = value / 255;
  return scaled <= 0.03928 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4;
}

function toHex(color: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return { hex: "", ink: "#000000" };

  context.fillStyle = "#010101";
  context.fillStyle = color;
  if (context.fillStyle === "#010101") return { hex: "", ink: "#000000" };

  context.clearRect(0, 0, 1, 1);
  context.fillRect(0, 0, 1, 1);
  const [red, green, blue, alpha] = context.getImageData(0, 0, 1, 1).data;
  const hex = [red, green, blue]
    .map((part) => part.toString(16).padStart(2, "0"))
    .join("");
  const suffix = alpha < 255 ? alpha.toString(16).padStart(2, "0") : "";
  const luminance =
    0.2126 * channel(red) + 0.7152 * channel(green) + 0.0722 * channel(blue);

  return {
    hex: `#${hex}${suffix}`,
    ink: luminance > 0.55 ? "#000000" : "#ffffff",
  };
}

function Swatch({ token }: { token: string }) {
  const chip = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState({ hex: "", ink: "#000000" });

  useEffect(() => {
    const element = chip.current;
    if (!element) return;

    const read = () =>
      setValue(toHex(getComputedStyle(element).backgroundColor));
    read();

    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class", "style"],
    });
    return () => observer.disconnect();
  }, [token]);

  return (
    <li className="flex flex-col gap-2 border-[3px] border-border bg-[var(--surface)] p-3">
      <span
        ref={chip}
        className="flex h-14 items-center justify-center border-[3px] border-border font-mono text-xs font-bold"
        style={{ background: `var(${token})`, color: value.ink }}
      >
        {value.hex}
      </span>
      <span className="font-mono text-xs font-bold">{token}</span>
    </li>
  );
}

export default function ColorsPage() {
  return (
    <Container title="Colors" fullWidth>
      <p className="max-w-2xl font-sans">
        Components read CSS variables. Paste new values in the same file that
        imports the library, after the import. Later rules replace the shipped
        palette. Change tokens that already exist here. A new named theme
        belongs on the Themes page.
      </p>

      <section className="flex w-full flex-col gap-3">
        <h3 className="font-display text-2xl font-bold">Default palette</h3>
        <p className="max-w-2xl font-sans">
          A <span className="font-mono">:root</span> block replaces light, and
          the colors used before a theme is chosen.
        </p>
        <CodeSnippet language="css" code={defaultOverride} />
      </section>

      <section className="flex w-full flex-col gap-3">
        <h3 className="font-display text-2xl font-bold">Dark palette</h3>
        <p className="max-w-2xl font-sans">
          <span className="font-mono">:root[data-theme="dark"]</span> replaces
          the dark theme only. <span className="font-mono">ThemeProvider</span>{" "}
          sets that attribute on <span className="font-mono">html</span>.
        </p>
        <CodeSnippet language="css" code={darkOverride} />
      </section>

      <section className="flex w-full flex-col gap-3">
        <h3 className="font-display text-2xl font-bold">Tokens</h3>
        <p className="max-w-2xl font-sans">
          These are the names to set. The hex inside each swatch is the value
          active on this page.
        </p>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {tokens.map((token) => (
            <Swatch key={token} token={token} />
          ))}
        </ul>
      </section>

      <section className="flex w-full flex-col gap-3">
        <h3 className="font-display text-2xl font-bold">Same variables</h3>
        <p className="max-w-2xl font-sans">
          This card sets <span className="font-mono">--main</span> and{" "}
          <span className="font-mono">--background</span> on a wrapper. The
          faces inside read those variables, which is what a later rule in{" "}
          <span className="font-mono">index.css</span> does for the whole app.
        </p>
        <div
          className="flex flex-col gap-4 bg-background p-6 text-foreground"
          style={{
            ["--main" as string]: "#facc15",
            ["--background" as string]: "#fffdeb",
            ["--main-foreground" as string]: "#000000",
            ["--foreground" as string]: "#000000",
            ["--border" as string]: "#000000",
          }}
        >
          <Button className="self-start">Press</Button>
          <Card wrapperClassName="max-w-sm">
            <CardHeader className="font-display text-xl font-bold">
              Overridden
            </CardHeader>
            <CardBody>Thick borders on a palette from the wrapper.</CardBody>
          </Card>
        </div>
      </section>
    </Container>
  );
}
