import { useState } from "react";
import { Container, Input } from "../../lib/main";
import { inputNotes } from "./component-notes";
import { ComponentNotes, Example } from "./shared";

export default function InputsPage() {
  const [name, setName] = useState("Ada");

  return (
    <Container title="Inputs" fullWidth>
      <p className="max-w-2xl font-sans">
        Input is a single-line field. valid and invalid paint the face. Inside a
        FormField those flags come from the field when you omit them.
      </p>

      <Example
        imports="Input"
        title="Controlled"
        summary="Read value and write it back from onChange, the same as a native input."
        code={`<Input
  value={name}
  placeholder="Your name"
  onChange={(event) => setName(event.target.value)}
/>`}
      >
        <label
          className="flex max-w-sm flex-col gap-2 font-mono text-sm font-bold"
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
      </Example>

      <Example
        imports="Input"
        title="Variants and sizes"
        summary="Primary, secondary, and outline set the face. Small, medium, and large set the height."
        code={`<Input variant="primary" size="sm" placeholder="Small" />
<Input variant="secondary" placeholder="Secondary" />
<Input variant="outline" size="lg" placeholder="Outline" rounded />`}
      >
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
      </Example>

      <Example
        imports="Input"
        title="Validity and disabled"
        summary="valid and invalid recolor the shadow plate. disabled blocks the field."
        code={`<Input valid placeholder="Valid" />
<Input invalid placeholder="Invalid" />
<Input disabled placeholder="Disabled" />
<Input shadow={false} placeholder="Flat" />`}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Input aria-label="Valid field" valid placeholder="Valid" />
          <Input aria-label="Invalid field" invalid placeholder="Invalid" />
          <Input aria-label="Disabled field" disabled placeholder="Disabled" />
          <Input aria-label="Flat field" shadow={false} placeholder="Flat" />
        </div>
      </Example>

      <ComponentNotes {...inputNotes} />
    </Container>
  );
}
