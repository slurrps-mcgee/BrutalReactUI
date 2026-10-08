import { useState } from "react";
import { Button, CodeSnippet, Container, Progress } from "../../lib/main";

const code = `<Progress
  value={value}
  variant="success"
  label="Upload progress"
  showValue
  shadow
  animate="scroll"
  rounded
/>`;

export default function ProgressPage() {
  const [value, setValue] = useState(42);

  return (
    <Container title="Progress" fullWidth animate="scroll" rounded>
      <div className="grid gap-3">
        <Progress
          value={value}
          variant="success"
          label="Upload progress"
          showValue
          shadow
          animate="scroll"
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
      </div>
      <div className="grid gap-3">
        <Progress value={25} size="sm" variant="primary" label="Primary 25%" />
        <Progress value={55} variant="warning" label="Warning 55%" />
        <Progress value={80} size="lg" variant="danger" label="Danger 80%" />
        <Progress variant="info" label="Loading indeterminate progress" />
      </div>
      <CodeSnippet code={code} language="tsx" rounded />
    </Container>
  );
}
