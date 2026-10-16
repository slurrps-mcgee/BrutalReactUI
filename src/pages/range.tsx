import { useState } from "react";
import { Container, Range } from "../../lib/main";
import { rangeNotes } from "./component-notes";
import { ComponentNotes, Example } from "./shared";

export default function RangePage() {
  const [volume, setVolume] = useState(40);
  const [steps, setSteps] = useState(5000);

  return (
    <Container title="Range" fullWidth>
      <p className="max-w-2xl font-sans">
        Range is a slider. showValue prints the current number. output replaces
        that text when the unit is not the raw value.
      </p>

      <Example
        title="Value"
        summary="Control the slider with value and onChange. min and max set the ends."
        code={`<Range
  label="Volume"
  min={0}
  max={100}
  value={volume}
  onChange={(event) => setVolume(Number(event.target.value))}
  showValue
/>`}
      >
        <Range
          label="Volume"
          min={0}
          max={100}
          value={volume}
          onChange={(event) => setVolume(Number(event.target.value))}
          showValue
          rounded
        />
        <p role="status" className="font-mono text-sm">
          Volume is <strong>{volume}%</strong>.
        </p>
      </Example>

      <Example
        title="Steps and custom output"
        summary="step snaps the thumb. output replaces the printed value."
        code={`<Range
  label="Daily step goal"
  min={1000}
  max={20000}
  step={1000}
  value={steps}
  output={\`\${steps.toLocaleString()} steps\`}
/>`}
      >
        <Range
          label="Daily step goal"
          min={1000}
          max={20000}
          step={1000}
          value={steps}
          onChange={(event) => setSteps(Number(event.target.value))}
          output={`${steps.toLocaleString()} steps`}
        />
      </Example>

      <Example
        title="Uncontrolled and disabled"
        summary="defaultValue sets the start when the field owns its state. disabled blocks the thumb."
        code={`<Range label="Default value" defaultValue={65} showValue />
<Range label="Disabled" defaultValue={25} showValue disabled />`}
      >
        <div className="grid gap-6">
          <Range label="Default value" defaultValue={65} showValue />
          <Range label="Disabled" defaultValue={25} showValue disabled />
        </div>
      </Example>

      <ComponentNotes {...rangeNotes} />
    </Container>
  );
}
