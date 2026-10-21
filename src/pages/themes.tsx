import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CodeSnippet,
  Container,
  themeBootScript,
} from "../../lib/main";
import { Example } from "./shared";

const vitePlugin = `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { brutalReactUi } from "brutal-react-ui/vite";

export default defineConfig({
  plugins: [react(), brutalReactUi()],
});`;

const vitePluginOcean = `brutalReactUi({
  colors: { ocean: "#06283d" },
})`;

const manualScript = `<script>
${themeBootScript()}
</script>`;

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
    <Container title="Themes" fluid>
      <p className="max-w-2xl font-sans">
        A theme is a named block in the same CSS file, after the library import.{" "}
        <span className="font-mono">ThemeProvider</span> writes{" "}
        <span className="font-mono">data-theme</span> on{" "}
        <span className="font-mono">html</span>, so the selector is{" "}
        <span className="font-mono">:root[data-theme="ocean"]</span>.{" "}
        <span className="font-mono">setTheme("ocean")</span> selects it. Tokens
        you leave out keep the default values.
      </p>

      <section className="flex w-full flex-col gap-3">
        <h3 className="font-display text-2xl font-bold">
          Before the first paint
        </h3>
        <p className="max-w-2xl font-sans">
          <span className="font-mono">ThemeProvider</span> runs after the
          browser has painted. A reload in dark mode would flash the light page.
          Put a blocking script at the start of{" "}
          <span className="font-mono">head</span>. It reads the same{" "}
          <span className="font-mono">theme</span> key, sets{" "}
          <span className="font-mono">data-theme</span>, and fills the page
          until the stylesheet loads. This showcase does that with the Vite
          plugin in <span className="font-mono">vite.config.ts</span>.
        </p>
        <CodeSnippet language="ts" code={vitePlugin} />
        <p className="max-w-2xl font-sans">
          Pass a background for each extra theme. Names other than{" "}
          <span className="font-mono">light</span> use the dark color scheme
          until you list them in <span className="font-mono">lightThemes</span>.
        </p>
        <CodeSnippet language="ts" code={vitePluginOcean} />
        <p className="max-w-2xl font-sans">
          Without Vite, paste{" "}
          <span className="font-mono">themeBootScript()</span> into{" "}
          <span className="font-mono">index.html</span>.{" "}
          <span className="font-mono">ThemeProvider</span> removes the inline
          color after mount so the stylesheet can follow later toggles.
        </p>
        <CodeSnippet language="html" code={manualScript} />
      </section>

      <p className="max-w-2xl font-sans">
        Create a new theme by copying the example and changing the colors.
      </p>
      <CodeSnippet language="css" code={oceanCss} />

      <Example
        title="Register the name"
        summary='themes replaces the built-in list. Keep "light" and "dark" in the array when those themes should remain. Another name turns ThemeToggle into a dropdown of the list. align right keeps that menu on the page. animate draws the control.'
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
