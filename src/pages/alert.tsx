import { useState } from "react";
import { Alert, Button, CodeSnippet, Container } from "../../lib/main";

const alertCode = `const [open, setOpen] = useState(true);

<Alert
  open={open}
  onOpenChange={setOpen}
  variant="warning"
  title="Unsaved changes"
  timer={8000}
  dismissible
>
  Save your work before leaving this page.
</Alert>`;

export default function AlertPage() {
  const [open, setOpen] = useState(true);

  return (
    <Container title="Alert" fullWidth animate="scroll" rounded>
      <p className="max-w-2xl font-sans">
        Use a controlled alert when the page needs to restore or otherwise react
        to dismissal.
      </p>

      <div className="flex flex-col gap-4">
        <Alert
          open={open}
          onOpenChange={setOpen}
          variant="warning"
          title="Unsaved changes"
          timer={8000}
          dismissible
          rounded
        >
          Save your work before leaving this page. This alert fades after eight
          seconds.
        </Alert>
        {!open && (
          <Button className="self-start" onClick={() => setOpen(true)}>
            Show alert
          </Button>
        )}

        <Alert variant="success" title="Changes saved">
          Your latest edits are now available.
        </Alert>
      </div>

      <CodeSnippet code={alertCode} language="tsx" rounded />
    </Container>
  );
}
