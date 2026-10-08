import { useState } from "react";
import { CodeSnippet, Container, Radio } from "../../lib/main";

const code = `<Radio
  name="plan"
  value="pro"
  checked={plan === "pro"}
  onChange={(event) => setPlan(event.target.value)}
  label="Pro"
/>`;

export default function RadioPage() {
  const [plan, setPlan] = useState("pro");

  return (
    <Container title="Radio" fullWidth>
      <fieldset className="grid gap-4 sm:grid-cols-3">
        <legend className="mb-3 font-mono text-sm font-bold">
          Choose a plan
        </legend>
        {["starter", "pro", "enterprise"].map((value, index) => (
          <Radio
            key={value}
            name="plan"
            value={value}
            checked={plan === value}
            onChange={(event) => setPlan(event.target.value)}
            label={value[0].toUpperCase() + value.slice(1)}
            size={index === 0 ? "sm" : index === 2 ? "lg" : "md"}
          />
        ))}
        <Radio name="plan" value="legacy" label="Legacy (disabled)" disabled />
      </fieldset>
      <p role="status" className="font-mono text-sm">
        Selected plan: <strong>{plan}</strong>
      </p>
      <form
        onSubmit={(event) => event.preventDefault()}
        className="flex flex-wrap items-center gap-4"
      >
        <Radio name="required-tier" value="basic" required label="Basic" />
        <Radio name="required-tier" value="plus" required label="Plus" />
        <button type="submit" className="font-mono font-bold underline">
          Validate required group
        </button>
      </form>
      <CodeSnippet code={code} language="tsx" />
    </Container>
  );
}
