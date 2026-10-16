import { useState } from "react";
import {
  Button,
  Container,
  Input,
  InputGroup,
  InputGroupText,
} from "../../lib/main";
import { inputGroupNotes } from "./component-notes";
import { ComponentNotes, Example } from "./shared";

export default function InputGroupPage() {
  const [domain, setDomain] = useState("");

  return (
    <Container title="Input Group" fullWidth>
      <p className="max-w-2xl font-sans">
        Input groups attach text or a button to a field. label names the group
        for assistive tech.
      </p>

      <Example
        title="Text and button"
        summary="InputGroupText sits beside the field. A button can fill or submit the value."
        code={`<InputGroup label="Website address" rounded>
  <InputGroupText>https://</InputGroupText>
  <Input aria-label="Domain" placeholder="example.com" />
  <Button>Fill</Button>
</InputGroup>`}
      >
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
        <p role="status" className="font-mono text-sm">
          Preview: <strong>https://{domain || "example.com"}</strong>
        </p>
      </Example>

      <Example
        title="Addons on both sides"
        summary="Text before and after the field share one border."
        code={`<InputGroup label="Price in US dollars">
  <InputGroupText>$</InputGroupText>
  <Input aria-label="Price" type="number" min="0" step="0.01" />
  <InputGroupText>USD</InputGroupText>
</InputGroup>`}
      >
        <InputGroup label="Price in US dollars">
          <InputGroupText aria-hidden="true">$</InputGroupText>
          <Input aria-label="Price" type="number" min="0" step="0.01" />
          <InputGroupText>USD</InputGroupText>
        </InputGroup>
      </Example>

      <Example
        title="Vertical and disabled"
        summary="orientation vertical stacks the fields. A disabled field blocks the group."
        code={`<InputGroup label="Contact" orientation="vertical">
  <Input aria-label="Email" type="email" placeholder="Email" />
  <Input aria-label="Phone" type="tel" placeholder="Phone" />
</InputGroup>
<InputGroup label="Disabled account">
  <InputGroupText>@</InputGroupText>
  <Input value="archived" disabled readOnly />
</InputGroup>`}
      >
        <div className="grid gap-6 md:grid-cols-2">
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
        </div>
      </Example>

      <Example
        title="Flat and borderless"
        summary="shadow false removes the offset. border false removes the strokes. rounded also rounds the end buttons."
        code={`<InputGroup label="Flat" shadow={false} rounded>
  <InputGroupText>https://</InputGroupText>
  <Input aria-label="Flat domain" placeholder="example.com" />
  <Button>Go</Button>
</InputGroup>
<InputGroup label="No stroke" border={false}>
  <Input aria-label="Borderless field" placeholder="No stroke" />
</InputGroup>`}
      >
        <InputGroup label="Flat website" shadow={false} rounded>
          <InputGroupText>https://</InputGroupText>
          <Input aria-label="Flat domain" placeholder="example.com" />
          <Button type="button">Go</Button>
        </InputGroup>
        <InputGroup label="Borderless field" border={false}>
          <Input aria-label="Borderless field" placeholder="No stroke" />
        </InputGroup>
      </Example>

      <ComponentNotes {...inputGroupNotes} />
    </Container>
  );
}
