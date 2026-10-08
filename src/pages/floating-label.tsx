import { useState } from "react";
import { CodeSnippet, Container, FloatingLabel, Input } from "../../lib/main";

const code = `<FloatingLabel label="Email">
  <Input type="email" required />
</FloatingLabel>
<FloatingLabel label="Disabled">
  <Input value="Read only" disabled readOnly />
</FloatingLabel>`;

export default function FloatingLabelPage() {
  const [email, setEmail] = useState("");

  return (
    <Container title="Floating Label" fullWidth>
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
        <FloatingLabel label="Valid example">
          <Input defaultValue="Ada" valid />
        </FloatingLabel>
        <FloatingLabel label="Invalid example">
          <Input defaultValue="Incomplete" invalid aria-invalid="true" />
        </FloatingLabel>
        <FloatingLabel label="Disabled">
          <Input value="Unavailable" disabled readOnly />
        </FloatingLabel>
        <button type="submit" className="font-mono font-bold underline">
          Validate required fields
        </button>
      </form>
      <p role="status" className="font-mono text-sm">
        Email: <strong>{email || "not entered"}</strong>
      </p>
      <CodeSnippet code={code} language="tsx" />
    </Container>
  );
}
