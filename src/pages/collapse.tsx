import { useState } from "react";
import {
  CodeSnippet,
  Collapse,
  CollapseContent,
  CollapseTrigger,
  Container,
} from "../../lib/main";

const code = `<Collapse open={open} onOpenChange={setOpen} rounded>
  <CollapseTrigger>Shipping details</CollapseTrigger>
  <CollapseContent>Orders ship in 2–3 business days.</CollapseContent>
</Collapse>`;

export default function CollapsePage() {
  const [open, setOpen] = useState(true);

  return (
    <Container title="Collapse" fullWidth animate="scroll" rounded>
      <p className="font-mono text-sm font-bold" aria-live="polite">
        Panel is {open ? "open" : "closed"}
      </p>
      <Collapse open={open} onOpenChange={setOpen} rounded>
        <CollapseTrigger>Shipping details</CollapseTrigger>
        <CollapseContent>
          Orders ship in 2–3 business days. The trigger exposes its expanded
          state and remains fully keyboard accessible.
        </CollapseContent>
      </Collapse>
      <Collapse disabled>
        <CollapseTrigger>Disabled details</CollapseTrigger>
        <CollapseContent>This panel is unavailable.</CollapseContent>
      </Collapse>
      <CodeSnippet code={code} language="tsx" rounded />
    </Container>
  );
}
