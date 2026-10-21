import { useState } from "react";
import {
  Collapse,
  CollapseContent,
  CollapseTrigger,
  Container,
} from "../../lib/main";
import { collapseNotes } from "./component-notes";
import { ComponentNotes, Example } from "./shared";

export default function CollapsePage() {
  const [open, setOpen] = useState(true);

  return (
    <Container title="Collapse" fluid animate="scroll" rounded>
      <p className="max-w-2xl font-sans">
        Collapse shows one panel. Control it with open, or leave it uncontrolled
        with defaultOpen.
      </p>

      <Example
        imports="Collapse, CollapseTrigger, CollapseContent"
        title="Controlled"
        summary="open and onOpenChange keep the expanded state in the page."
        code={`<Collapse open={open} onOpenChange={setOpen} rounded>
  <CollapseTrigger>Shipping details</CollapseTrigger>
  <CollapseContent>
    Orders ship in 2–3 business days.
  </CollapseContent>
</Collapse>`}
      >
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
      </Example>

      <Example
        imports="Collapse, CollapseTrigger, CollapseContent"
        title="Uncontrolled"
        summary="defaultOpen starts the panel open. The collapse owns the state after that."
        code={`<Collapse defaultOpen={false}>
  <CollapseTrigger>Returns</CollapseTrigger>
  <CollapseContent>Returns are accepted within 30 days.</CollapseContent>
</Collapse>`}
      >
        <Collapse>
          <CollapseTrigger>Returns</CollapseTrigger>
          <CollapseContent>
            Returns are accepted within 30 days.
          </CollapseContent>
        </Collapse>
      </Example>

      <Example
        imports="Collapse, CollapseTrigger, CollapseContent"
        title="Disabled"
        summary="disabled blocks the trigger and keeps the panel closed."
        code={`<Collapse disabled>
  <CollapseTrigger>Disabled details</CollapseTrigger>
  <CollapseContent>This panel is unavailable.</CollapseContent>
</Collapse>`}
      >
        <Collapse disabled>
          <CollapseTrigger>Disabled details</CollapseTrigger>
          <CollapseContent>This panel is unavailable.</CollapseContent>
        </Collapse>
      </Example>

      <Example
        imports="Collapse, CollapseTrigger, CollapseContent"
        title="Rounded and borderless"
        summary="rounded and border on Collapse pass to the panel. border on the content puts the top rule back."
        code={`<Collapse rounded>
  <CollapseTrigger>Rounded</CollapseTrigger>
  <CollapseContent>The panel follows the radius.</CollapseContent>
</Collapse>
<Collapse border={false}>
  <CollapseTrigger>No stroke</CollapseTrigger>
  <CollapseContent border>The top rule stays.</CollapseContent>
</Collapse>`}
      >
        <Collapse rounded defaultOpen>
          <CollapseTrigger>Rounded panel</CollapseTrigger>
          <CollapseContent>The panel follows the radius.</CollapseContent>
        </Collapse>
        <Collapse border={false} defaultOpen>
          <CollapseTrigger>No stroke</CollapseTrigger>
          <CollapseContent border>The top rule stays.</CollapseContent>
        </Collapse>
      </Example>

      <ComponentNotes {...collapseNotes} />
    </Container>
  );
}
