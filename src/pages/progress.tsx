import { useState } from "react";
import { Button, Container, Progress } from "../../lib/main";
import { progressNotes } from "./component-notes";
import { ComponentNotes, Example } from "./shared";

export default function ProgressPage() {
  const [value, setValue] = useState(42);

  return (
    <Container title="Progress" fluid animate="scroll" rounded>
      <p className="max-w-2xl font-sans">
        Progress shows how far a task has gone. Omit value for an indeterminate
        bar.
      </p>

      <Example
        imports="Progress"
        title="Determinate"
        summary="value is a number from 0 to 100. showValue prints it beside the label."
        code={`<Progress
  value={value}
  variant="success"
  label="Upload progress"
  showValue
  shadow
  rounded
/>`}
      >
        <Progress
          value={value}
          variant="success"
          label="Upload progress"
          showValue
          shadow
          rounded
          size="lg"
        />
        <div className="flex flex-wrap gap-3">
          <Button
            size="sm"
            variant="outline"
            disabled={value === 0}
            onClick={() => setValue((current) => Math.max(0, current - 10))}
          >
            Decrease
          </Button>
          <Button
            size="sm"
            disabled={value === 100}
            onClick={() => setValue((current) => Math.min(100, current + 10))}
          >
            Increase
          </Button>
        </div>
      </Example>

      <Example
        imports="Progress"
        title="Variants and sizes"
        summary="The variant colors the bar. Small, medium, and large set its height."
        code={`<Progress value={25} size="sm" variant="primary" label="Primary 25%" />
<Progress value={55} variant="warning" label="Warning 55%" />
<Progress value={80} size="lg" variant="danger" label="Danger 80%" />`}
      >
        <div className="grid gap-3">
          <Progress
            value={25}
            size="sm"
            variant="primary"
            label="Primary 25%"
          />
          <Progress value={55} variant="warning" label="Warning 55%" />
          <Progress value={80} size="lg" variant="danger" label="Danger 80%" />
        </div>
      </Example>

      <Example
        imports="Progress"
        title="Indeterminate"
        summary="Leave value off while the length of the task is unknown."
        code={`<Progress variant="info" label="Loading" />`}
      >
        <Progress variant="info" label="Loading indeterminate progress" />
      </Example>

      <Example
        imports="Progress"
        title="Flat and borderless"
        summary="shadow is on by default. shadow false removes the offset. border false removes the track stroke."
        code={`<Progress value={40} shadow={false} label="Flat 40%" />
<Progress value={40} border={false} label="No stroke 40%" />`}
      >
        <Progress value={40} shadow={false} label="Flat 40%" />
        <Progress value={40} border={false} label="No stroke 40%" />
      </Example>

      <ComponentNotes {...progressNotes} />
    </Container>
  );
}
