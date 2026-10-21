import { useState } from "react";
import { Container, FloatingLabel, Input } from "../../lib/main";
import { floatingLabelNotes } from "./component-notes";
import { ComponentNotes, Example } from "./shared";

export default function FloatingLabelPage() {
  const [email, setEmail] = useState("");

  return (
    <Container title="Floating Label" fluid>
      <p className="max-w-2xl font-sans">
        A floating label rests in the field and rises when the field has a value
        or focus. The label text is the accessible name.
      </p>

      <Example
        imports="FloatingLabel, Input"
        title="Required fields"
        summary="Put the Input inside FloatingLabel. required still uses native validation."
        code={`<FloatingLabel label="Email address">
  <Input type="email" required />
</FloatingLabel>
<FloatingLabel label="Password">
  <Input type="password" minLength={8} required />
</FloatingLabel>`}
      >
        <form
          onSubmit={(event) => event.preventDefault()}
          className="grid max-w-2xl gap-5 sm:grid-cols-2"
        >
          <FloatingLabel label="Email address">
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </FloatingLabel>
          <FloatingLabel label="Password">
            <Input type="password" minLength={8} required rounded />
          </FloatingLabel>
          <button type="submit" className="font-mono font-bold underline">
            Validate required fields
          </button>
        </form>
        <p role="status" className="font-mono text-sm">
          Email: <strong>{email || "not entered"}</strong>
        </p>
      </Example>

      <Example
        imports="FloatingLabel, Input"
        title="Validity"
        summary="valid and invalid on the input recolor the field while the label stays attached."
        code={`<FloatingLabel label="Valid example">
  <Input defaultValue="Ada" valid />
</FloatingLabel>
<FloatingLabel label="Invalid example">
  <Input defaultValue="Incomplete" invalid />
</FloatingLabel>`}
      >
        <div className="grid max-w-2xl gap-5 sm:grid-cols-2">
          <FloatingLabel label="Valid example">
            <Input defaultValue="Ada" valid />
          </FloatingLabel>
          <FloatingLabel label="Invalid example">
            <Input defaultValue="Incomplete" invalid aria-invalid="true" />
          </FloatingLabel>
        </div>
      </Example>

      <Example
        imports="FloatingLabel, Input"
        title="Disabled"
        summary="A disabled input keeps the label raised and blocks editing."
        code={`<FloatingLabel label="Disabled">
  <Input value="Unavailable" disabled readOnly />
</FloatingLabel>`}
      >
        <div className="max-w-sm">
          <FloatingLabel label="Disabled">
            <Input value="Unavailable" disabled readOnly />
          </FloatingLabel>
        </div>
      </Example>

      <ComponentNotes {...floatingLabelNotes} />
    </Container>
  );
}
