import { useState } from "react";
import { CodeSnippet, Container, Range } from "../../lib/main";

const code = `<Range
  label="Volume"
  min={0}
  max={100}
  value={volume}
  onChange={(event) => setVolume(Number(event.target.value))}
  showValue
  rounded
/>`;

export default function RangePage() {
  const [volume, setVolume] = useState(40);
  const [steps, setSteps] = useState(5000);

  return (
    <Container title="Range" fullWidth>
      <div className="grid gap-6 md:grid-cols-2">
        <Range
          label="Volume"
          min={0}
          max={100}
          value={volume}
          onChange={(event) => setVolume(Number(event.target.value))}
          showValue
          rounded
          aria-label="Volume percentage"
        />
        <Range
          label="Daily step goal"
          min={1000}
          max={20000}
          step={1000}
          value={steps}
          onChange={(event) => setSteps(Number(event.target.value))}
          output={`${steps.toLocaleString()} steps`}
        />
        <Range label="Default value" defaultValue={65} showValue />
        <Range label="Disabled" defaultValue={25} showValue disabled />
      </div>
      <p role="status" className="font-mono text-sm">
        Volume is <strong>{volume}%</strong>.
      </p>
      <CodeSnippet code={code} language="tsx" />
    </Container>
  );
}
