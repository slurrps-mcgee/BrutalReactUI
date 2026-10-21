import { useState } from "react";
import { Checkbox, Container } from "../../lib/main";
import { checkboxNotes } from "./component-notes";
import { ComponentNotes, Example } from "./shared";

export default function CheckboxPage() {
  const [accepted, setAccepted] = useState(false);
  const [updates, setUpdates] = useState(true);

  return (
    <Container title="Checkbox" fluid>
      <p className="max-w-2xl font-sans">
        Checkbox pairs a real input with a visible box. The label sits beside
        the control.
      </p>

      <Example
        imports="Checkbox"
        title="Checked state"
        summary="Use checked and onChange for a controlled box. The status line follows the values."
        code={`<Checkbox
  checked={accepted}
  onChange={(event) => setAccepted(event.target.checked)}
  label="Accept terms"
/>
<Checkbox label="Product updates" defaultChecked />`}
      >
        <fieldset className="grid gap-4">
          <legend className="mb-1 font-mono text-sm font-bold">
            Notification preferences
          </legend>
          <Checkbox
            checked={updates}
            onChange={(event) => setUpdates(event.target.checked)}
            label="Product updates"
          />
          <Checkbox
            checked={accepted}
            onChange={(event) => setAccepted(event.target.checked)}
            label="Accept terms"
            required
          />
        </fieldset>
        <p role="status" className="font-mono text-sm">
          Terms: <strong>{accepted ? "accepted" : "not accepted"}</strong>;
          updates: <strong>{updates ? "on" : "off"}</strong>.
        </p>
      </Example>

      <Example
        imports="Checkbox"
        title="Sizes"
        summary="Small, medium, and large scale the box and the label."
        code={`<Checkbox size="sm" label="Small" />
<Checkbox size="md" label="Medium" />
<Checkbox size="lg" label="Large" rounded />`}
      >
        <div className="grid gap-4">
          <Checkbox size="sm" label="Small" defaultChecked />
          <Checkbox size="md" label="Medium" />
          <Checkbox size="lg" label="Large" rounded />
        </div>
      </Example>

      <Example
        imports="Checkbox"
        title="Disabled and required"
        summary="disabled blocks the box. required takes part in native form validation."
        code={`<Checkbox label="Unavailable" disabled />
<Checkbox name="consent" required label="Required" />`}
      >
        <form
          onSubmit={(event) => event.preventDefault()}
          className="flex flex-wrap items-center gap-4"
        >
          <Checkbox label="Unavailable option" disabled />
          <Checkbox name="consent" required label="Required native checkbox" />
          <button type="submit" className="font-mono font-bold underline">
            Validate
          </button>
        </form>
      </Example>

      <Example
        imports="Checkbox"
        title="Flat"
        summary="shadow false keeps the box from lifting when it is checked."
        code={`<Checkbox label="Flat" shadow={false} defaultChecked />`}
      >
        <Checkbox label="Flat checkbox" shadow={false} defaultChecked />
      </Example>

      <ComponentNotes {...checkboxNotes} />
    </Container>
  );
}
