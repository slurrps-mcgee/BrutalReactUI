import { Container, Link } from "../../lib/main";
import { linkNotes } from "./component-notes";
import { ComponentNotes, Example } from "./shared";

export default function LinksPage() {
  return (
    <Container title="Links" fullWidth>
      <p className="max-w-2xl font-sans">
        Link is a text link with a hover ink slide and an arrow. External http
        and https addresses open in a new tab.
      </p>

      <Example
        title="Variants"
        summary="Default uses the page ink. Primary and secondary swap the resting and hover colors."
        code={`<Link href="#/buttons">Default</Link>
<Link href="#/buttons" variant="primary">Primary</Link>
<Link href="#/buttons" variant="secondary">Secondary</Link>`}
      >
        <div className="flex flex-wrap items-center gap-6">
          <Link href="#/buttons">Default</Link>
          <Link href="#/buttons" variant="primary">
            Primary
          </Link>
          <Link href="#/buttons" variant="secondary">
            Secondary
          </Link>
        </div>
      </Example>

      <Example
        title="Sizes"
        summary="Medium is the default type size."
        code={`<Link href="#/buttons" size="sm">Small</Link>
<Link href="#/buttons" size="md">Medium</Link>
<Link href="#/buttons" size="lg">Large</Link>`}
      >
        <div className="flex flex-wrap items-center gap-6">
          <Link href="#/buttons" size="sm">
            Small
          </Link>
          <Link href="#/buttons" size="md">
            Medium
          </Link>
          <Link href="#/buttons" size="lg">
            Large
          </Link>
        </div>
      </Example>

      <Example
        title="Disabled and external"
        summary="disabled removes the destination. An https address opens in a new tab."
        code={`<Link href="#/buttons" disabled>Disabled</Link>
<Link href="https://github.com" variant="secondary">GitHub</Link>`}
      >
        <div className="flex flex-wrap items-center gap-6">
          <Link href="#/buttons" disabled>
            Disabled
          </Link>
          <Link href="https://github.com" variant="secondary">
            GitHub
          </Link>
        </div>
      </Example>

      <ComponentNotes {...linkNotes} />
    </Container>
  );
}
