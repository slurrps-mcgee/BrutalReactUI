import { Button, Container, Spinner } from "../../lib/main";
import { spinnerNotes } from "./component-notes";
import { ComponentNotes, Example } from "./shared";

const variants = [
  "primary",
  "secondary",
  "success",
  "warning",
  "danger",
  "info",
] as const;

export default function SpinnerPage() {
  return (
    <Container title="Spinner" fullWidth animate="scroll" rounded>
      <p className="max-w-2xl font-sans">
        Spinner marks a wait. label is the accessible name and stays visually
        hidden.
      </p>

      <Example
        title="Variants"
        summary="Each variant sets the stroke color. current inherits the parent text color."
        code={`<Spinner variant="primary" label="Loading" />
<Spinner variant="success" label="Saving" />
<Spinner variant="current" label="Working" />`}
      >
        <div className="flex flex-wrap items-center gap-8">
          {variants.map((variant) => (
            <Spinner
              key={variant}
              variant={variant}
              label={`Loading ${variant}`}
            />
          ))}
        </div>
      </Example>

      <Example
        title="Sizes"
        summary="Small, medium, and large set the diameter."
        code={`<Spinner size="sm" label="Small" />
<Spinner size="md" label="Medium" />
<Spinner size="lg" label="Large" />`}
      >
        <div className="flex flex-wrap items-center gap-8">
          <Spinner size="sm" label="Loading small item" />
          <Spinner size="md" label="Loading medium item" />
          <Spinner size="lg" label="Loading large item" />
        </div>
      </Example>

      <Example
        title="Inside a button"
        summary="current matches the button label while the action is in progress."
        code={`<Button disabled>
  <Spinner variant="current" size="sm" label="Submitting form" />
  Submitting
</Button>`}
      >
        <Button disabled className="self-start">
          <Spinner variant="current" size="sm" label="Submitting form" />
          Submitting
        </Button>
      </Example>

      <ComponentNotes {...spinnerNotes} />
    </Container>
  );
}
