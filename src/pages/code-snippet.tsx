import { CodeSnippet, Container } from "../../lib/main";
import { codeSnippetNotes } from "./component-notes";
import { ComponentNotes, Example } from "./shared";

const exactCode = `function WelcomeCard() {
  const greeting = "Hello";

  return (
    <section aria-labelledby="welcome-title">
      <h2 id="welcome-title">{greeting}</h2>
      <p>Every space and line break is preserved.</p>
    </section>
  );
}`;

export default function CodeSnippetPage() {
  return (
    <Container title="Code Snippet" fluid animate="scroll" rounded>
      <p className="max-w-2xl font-sans">
        Code snippets show source with highlighting. The copy control writes the
        same string that is on the page.
      </p>

      <Example
        imports="CodeSnippet"
        title="TypeScript"
        summary="language picks the highlighter. Spaces and line breaks stay as written."
        code={`<CodeSnippet code={source} language="tsx" showLanguage rounded />`}
      >
        <CodeSnippet code={exactCode} language="tsx" showLanguage rounded />
      </Example>

      <Example
        imports="CodeSnippet"
        title="Variants"
        summary="secondary and outline change the block face. animate draws the frame on scroll."
        code={`<CodeSnippet
  code="const ready = true;"
  language="ts"
  variant="secondary"
  animate="scroll"
/>
<CodeSnippet code="const count = 1;" language="ts" variant="info" />`}
      >
        <CodeSnippet
          code="const ready = true;"
          language="ts"
          variant="secondary"
          animate="scroll"
          showLanguage
        />
        <CodeSnippet
          code="const count = 1;"
          language="ts"
          variant="info"
          showLanguage
        />
      </Example>

      <Example
        imports="CodeSnippet"
        title="Wrap and flat"
        summary="wrap breaks long lines instead of scrolling sideways. shadow false removes the offset."
        code={`<CodeSnippet code={source} language="tsx" wrap shadow={false} />`}
      >
        <CodeSnippet
          code={exactCode}
          language="tsx"
          wrap
          shadow={false}
          showLanguage
        />
      </Example>

      <ComponentNotes {...codeSnippetNotes} />
    </Container>
  );
}
