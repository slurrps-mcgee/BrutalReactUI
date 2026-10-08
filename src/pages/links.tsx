import { CodeSnippet, Container, Link } from "../../lib/main";

export default function LinksPage() {
  return (
    <Container title="Links" fullWidth>
      <div className="flex flex-wrap gap-6">
        <Link href="#/buttons">Back to buttons</Link>
        <Link href="#/buttons" variant="primary">
          Primary
        </Link>
        <Link href="https://github.com" variant="secondary" size="lg">
          GitHub
        </Link>
      </div>
      <CodeSnippet
        language="tsx"
        code={`<Link href="#/buttons">Back to buttons</Link>
<Link href="#/buttons" variant="primary">Primary</Link>
<Link href="https://github.com" variant="secondary" size="lg">GitHub</Link>`}
      />
    </Container>
  );
}
