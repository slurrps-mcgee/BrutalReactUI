import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CodeSnippet,
  Container,
} from "../../lib/main";
import { Example } from "./shared";

const oceanCss = `@import "brutal-react-ui/styles.css";

:root[data-theme="ocean"] {
  color-scheme: dark;
  --background: #06283d;
  --main: #47b5ff;
  --main-foreground: #06283d;
  --foreground: #dff6ff;
  --border: #dff6ff;
}`;

export default function ThemesPage() {
  return (
    <Container title="Themes" fullWidth>
      <p className="max-w-2xl font-sans">
        A theme is a named block in the same CSS file, after the library import.{" "}
        <span className="font-mono">ThemeProvider</span> writes{" "}
        <span className="font-mono">data-theme</span> on{" "}
        <span className="font-mono">html</span>, so the selector is{" "}
        <span className="font-mono">:root[data-theme="ocean"]</span>.{" "}
        <span className="font-mono">setTheme("ocean")</span> selects it. Tokens
        you leave out keep the default values.
      </p>

      <CodeSnippet language="css" code={oceanCss} />

      <Example
        title="Register the name"
        summary='themes replaces the built-in list. Keep "light" and "dark" in the array when those themes should remain.'
        imports="ThemeProvider"
        code={`<ThemeProvider themes={["light", "dark", "ocean"]}>
  <App />
</ThemeProvider>`}
      >
        <div
          data-theme="ocean"
          className="flex flex-col gap-4 bg-background p-6 text-foreground"
        >
          <Button className="self-start">Press</Button>
          <Card wrapperClassName="max-w-sm">
            <CardHeader className="font-display text-xl font-bold">
              Ocean
            </CardHeader>
            <CardBody>
              This card sits in data-theme=&quot;ocean&quot;. The app selector
              is on html.
            </CardBody>
          </Card>
        </div>
      </Example>
    </Container>
  );
}
