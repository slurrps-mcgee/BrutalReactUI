import { useState } from "react";
import { CodeSnippet, Container, Input } from "../../lib/main";

export default function InputsPage() {
  const [name, setName] = useState("Ada");

  return (
    <Container title="Inputs" fullWidth>
      <label
        className="flex flex-col gap-2 font-mono text-sm font-bold"
        htmlFor="display-name"
      >
        Display name
        <Input
          id="display-name"
          name="display-name"
          value={name}
          placeholder="Your name"
          onChange={(event) => setName(event.target.value)}
        />
      </label>
      <p className="font-mono text-sm">
        Hello, <span className="font-bold">{name || "stranger"}</span>.
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        <Input
          aria-label="Primary field"
          variant="primary"
          size="sm"
          placeholder="Small"
        />
        <Input
          aria-label="Secondary field"
          variant="secondary"
          placeholder="Secondary"
        />
        <Input
          aria-label="Outline field"
          variant="outline"
          size="lg"
          placeholder="Outline"
          rounded
        />
      </div>
      <CodeSnippet
        language="tsx"
        code={`<Input value={name} placeholder="Your name" />
<Input variant="primary" size="sm" placeholder="Small" />
<Input variant="secondary" placeholder="Secondary" />
<Input variant="outline" size="lg" placeholder="Outline" rounded />`}
      />
    </Container>
  );
}
