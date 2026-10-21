import { useState } from "react";
import { Container, Radio } from "../../lib/main";
import { radioNotes } from "./component-notes";
import { ComponentNotes, Example } from "./shared";

export default function RadioPage() {
  const [plan, setPlan] = useState("pro");

  return (
    <Container title="Radio" fluid>
      <p className="max-w-2xl font-sans">
        Radios in one group share a name. Only one can be checked. The visible
        ring is the face; the input stays the real control.
      </p>

      <Example
        imports="Radio"
        title="Group"
        summary="Control the group with one piece of state. checked compares each value."
        code={`<Radio
  name="plan"
  value="pro"
  checked={plan === "pro"}
  onChange={(event) => setPlan(event.target.value)}
  label="Pro"
/>`}
      >
        <fieldset className="grid gap-4">
          <legend className="mb-1 font-mono text-sm font-bold">
            Choose a plan
          </legend>
          {["starter", "pro", "enterprise"].map((value) => (
            <Radio
              key={value}
              name="plan"
              value={value}
              checked={plan === value}
              onChange={(event) => setPlan(event.target.value)}
              label={value[0].toUpperCase() + value.slice(1)}
            />
          ))}
        </fieldset>
        <p role="status" className="font-mono text-sm">
          Selected plan: <strong>{plan}</strong>
        </p>
      </Example>

      <Example
        imports="Radio"
        title="Sizes"
        summary="Small, medium, and large scale the ring and the label."
        code={`<Radio name="size" value="sm" size="sm" label="Small" />
<Radio name="size" value="md" size="md" label="Medium" />
<Radio name="size" value="lg" size="lg" label="Large" rounded />`}
      >
        <div className="grid gap-4">
          <Radio name="size-demo" value="sm" size="sm" label="Small" />
          <Radio
            name="size-demo"
            value="md"
            size="md"
            label="Medium"
            defaultChecked
          />
          <Radio name="size-demo" value="lg" size="lg" label="Large" rounded />
        </div>
      </Example>

      <Example
        imports="Radio"
        title="Disabled and required"
        summary="disabled blocks that option. required on a group takes part in native validation."
        code={`<Radio name="plan" value="legacy" label="Legacy" disabled />
<Radio name="tier" value="basic" required label="Basic" />
<Radio name="tier" value="plus" required label="Plus" />`}
      >
        <form
          onSubmit={(event) => event.preventDefault()}
          className="grid gap-4"
        >
          <Radio
            name="plan-off"
            value="legacy"
            label="Legacy (disabled)"
            disabled
          />
          <div className="flex flex-wrap items-center gap-4">
            <Radio name="required-tier" value="basic" required label="Basic" />
            <Radio name="required-tier" value="plus" required label="Plus" />
            <button type="submit" className="font-mono font-bold underline">
              Validate required group
            </button>
          </div>
        </form>
      </Example>

      <Example
        imports="Radio"
        title="Flat"
        summary="shadow false keeps a selected option from lifting."
        code={`<Radio name="flat" value="flat" label="Flat" shadow={false} defaultChecked />`}
      >
        <Radio
          name="flat-demo"
          value="flat"
          label="Flat radio"
          shadow={false}
          defaultChecked
        />
      </Example>

      <ComponentNotes {...radioNotes} />
    </Container>
  );
}
