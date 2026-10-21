import { useState } from "react";
import { Alert, Button, Container } from "../../lib/main";
import { alertNotes } from "./component-notes";
import { ComponentNotes, Example } from "./shared";

const variants = [
  "primary",
  "secondary",
  "success",
  "warning",
  "danger",
  "info",
] as const;

export default function AlertPage() {
  const [open, setOpen] = useState(true);
  const [timed, setTimed] = useState(true);
  const [timerKey, setTimerKey] = useState(0);

  return (
    <Container title="Alert" fluid animate="scroll" rounded>
      <p className="max-w-2xl font-sans">
        Alerts call attention to a short status. Use a live region when the
        message appears after an action.
      </p>

      <Example
        imports="Alert"
        title="Variants"
        summary="Each variant sets the face color and the default icon."
        code={`<Alert variant="success" title="Saved">Your edits are stored.</Alert>
<Alert variant="warning" title="Check">Review this before you continue.</Alert>
<Alert variant="danger" title="Failed">The request did not go through.</Alert>`}
      >
        <div className="flex flex-col gap-4">
          {variants.map((variant) => (
            <Alert key={variant} variant={variant} title={variant} rounded>
              This is a {variant} alert.
            </Alert>
          ))}
        </div>
      </Example>

      <Example
        imports="Alert"
        title="Dismissible"
        summary="Control open when the page needs to bring the alert back. The close control calls onOpenChange."
        code={`<Alert
  open={open}
  onOpenChange={setOpen}
  variant="warning"
  title="Unsaved changes"
  dismissible
>
  Save your work before leaving this page.
</Alert>`}
      >
        <div className="flex flex-col gap-4">
          <Alert
            open={open}
            onOpenChange={setOpen}
            variant="warning"
            title="Unsaved changes"
            dismissible
            rounded
          >
            Save your work before leaving this page.
          </Alert>
          {!open && (
            <Button className="self-start" onClick={() => setOpen(true)}>
              Show alert
            </Button>
          )}
        </div>
      </Example>

      <Example
        imports="Alert, Button"
        title="Timer and actions"
        summary="duration dismisses the alert after a number of milliseconds. actions holds buttons or links beside the message."
        code={`<Alert
  variant="info"
  title="New version"
  duration={8000}
  dismissible
  actions={<Button size="sm">Update</Button>}
>
  A release is ready to install.
</Alert>`}
      >
        {timed ? (
          <Alert
            key={timerKey}
            variant="info"
            title="New version"
            duration={8000}
            dismissible
            rounded
            onOpenChange={setTimed}
            actions={
              <Button size="sm" variant="outline">
                Update
              </Button>
            }
          >
            A release is ready to install. This alert fades after eight seconds.
          </Alert>
        ) : (
          <Button
            className="self-start"
            onClick={() => {
              setTimed(true);
              setTimerKey((value) => value + 1);
            }}
          >
            Show alert
          </Button>
        )}
      </Example>

      <Example
        imports="Alert"
        title="Flat and borderless"
        summary="shadow false removes the offset. border false removes the stroke."
        code={`<Alert shadow={false} title="Flat">No offset.</Alert>
<Alert border={false} title="No stroke">The fill stays.</Alert>`}
      >
        <Alert shadow={false} title="Flat">
          No offset.
        </Alert>
        <Alert border={false} variant="secondary" title="No stroke">
          The fill stays.
        </Alert>
      </Example>

      <ComponentNotes {...alertNotes} />
    </Container>
  );
}
