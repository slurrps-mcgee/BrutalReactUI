import { CodeSnippet, Container } from "../../lib/main";

const exactCode = `function WelcomeCard() {
  const greeting = "Hello";

  return (
    <section aria-labelledby="welcome-title">
      <h2 id="welcome-title">{greeting}</h2>
      <p>Every space and line break is preserved.</p>
    </section>
  );
}`;

const usageCode = `<CodeSnippet
  code={source}
  language="tsx"
  variant="secondary"
  showLanguage
  rounded
/>`;

export default function CodeSnippetPage() {
  return (
    <Container title="Code Snippet" fullWidth animate="scroll" rounded>
      <p className="max-w-2xl font-sans">
        Syntax highlighting preserves the source exactly as supplied, and the
        copy control writes that same string to the clipboard.
      </p>

      <CodeSnippet
        code={exactCode}
        language="tsx"
        variant="secondary"
        animate="scroll"
        rounded
      />

      <CodeSnippet code={usageCode} language="tsx" />
    </Container>
  );
}
