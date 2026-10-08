import { useState } from "react";
import {
  Button,
  CodeSnippet,
  Container,
  Input,
  InputGroup,
  InputGroupText,
} from "../../lib/main";

const code = `<InputGroup label="Website address" rounded>
  <InputGroupText>https://</InputGroupText>
  <Input aria-label="Domain" placeholder="example.com" />
  <Button>Open</Button>
</InputGroup>`;

export default function InputGroupPage() {
  const [domain, setDomain] = useState("");

  return (
    <Container title="Input Group" fullWidth>
      <InputGroup label="Website address" rounded>
        <InputGroupText aria-hidden="true">https://</InputGroupText>
        <Input
          aria-label="Domain"
          value={domain}
          onChange={(event) => setDomain(event.target.value)}
          placeholder="example.com"
          required
        />
        <Button type="button" onClick={() => setDomain("brutal.dev")}>
          Fill
        </Button>
      </InputGroup>
      <InputGroup label="Price in US dollars">
        <InputGroupText aria-hidden="true">$</InputGroupText>
        <Input aria-label="Price" type="number" min="0" step="0.01" />
        <InputGroupText>USD</InputGroupText>
      </InputGroup>
      <InputGroup label="Vertical contact fields" orientation="vertical">
        <Input aria-label="Email" type="email" placeholder="Email" />
        <Input aria-label="Phone" type="tel" placeholder="Phone" />
      </InputGroup>
      <InputGroup label="Disabled account">
        <InputGroupText>@</InputGroupText>
        <Input
          aria-label="Disabled username"
          value="archived"
          disabled
          readOnly
        />
      </InputGroup>
      <p role="status" className="font-mono text-sm">
        Preview: <strong>https://{domain || "example.com"}</strong>
      </p>
      <CodeSnippet code={code} language="tsx" />
    </Container>
  );
}
