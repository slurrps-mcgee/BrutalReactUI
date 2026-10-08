import { useState } from "react";
import { Checkbox, CodeSnippet, Container } from "../../lib/main";

const code = `<Checkbox
  checked={accepted}
  onChange={(event) => setAccepted(event.target.checked)}
  label="Accept terms"
  required
/>
<Checkbox label="Disabled" disabled />`;

export default function CheckboxPage() {
  const [accepted, setAccepted] = useState(false);
  const [updates, setUpdates] = useState(true);

  return (
    <Container title="Checkbox" fullWidth>
      <fieldset className="grid gap-4">
        <legend className="mb-3 font-mono text-sm font-bold">
          Notification preferences
        </legend>
        <Checkbox
          checked={updates}
          onChange={(event) => setUpdates(event.target.checked)}
          label="Product updates"
          size="sm"
        />
        <Checkbox
          checked={accepted}
          onChange={(event) => setAccepted(event.target.checked)}
          label="Accept terms (required)"
          required
          rounded
          size="lg"
        />
        <Checkbox label="Unavailable option" disabled />
      </fieldset>
      <p role="status" className="font-mono text-sm">
        Terms: <strong>{accepted ? "accepted" : "not accepted"}</strong>;
        updates: <strong>{updates ? "on" : "off"}</strong>.
      </p>
      <form
        onSubmit={(event) => event.preventDefault()}
        className="flex flex-wrap items-center gap-4"
      >
        <Checkbox name="consent" required label="Required native checkbox" />
        <button type="submit" className="font-mono font-bold underline">
          Validate
        </button>
      </form>
      <CodeSnippet code={code} language="tsx" />
    </Container>
  );
}
