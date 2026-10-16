import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Container,
} from "../../lib/main";
import { accordionNotes } from "./component-notes";
import { ComponentNotes, Example } from "./shared";

export default function AccordionPage() {
  return (
    <Container title="Accordion" fullWidth animate="scroll" rounded>
      <p className="max-w-2xl font-sans">
        Accordions stack panels that open and close. type single keeps one panel
        open. type multiple allows several.
      </p>

      <Example
        title="Multiple"
        summary="defaultValue lists the panels that start open. A disabled item cannot be opened."
        code={`<Accordion type="multiple" defaultValue={["keyboard"]} rounded>
  <AccordionItem value="keyboard">
    <AccordionTrigger>Keyboard support</AccordionTrigger>
    <AccordionContent>
      Use Arrow Up, Arrow Down, Home, and End between triggers.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="disabled" disabled>
    <AccordionTrigger>Disabled panel</AccordionTrigger>
    <AccordionContent>This content cannot be opened.</AccordionContent>
  </AccordionItem>
</Accordion>`}
      >
        <Accordion type="multiple" defaultValue={["keyboard"]} rounded>
          <AccordionItem value="keyboard">
            <AccordionTrigger>Keyboard support</AccordionTrigger>
            <AccordionContent>
              Use Arrow Up, Arrow Down, Home, and End between triggers.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="multiple">
            <AccordionTrigger>Multiple panels</AccordionTrigger>
            <AccordionContent>
              This example allows more than one panel to remain open.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="disabled" disabled>
            <AccordionTrigger>Disabled panel</AccordionTrigger>
            <AccordionContent>This content cannot be opened.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </Example>

      <Example
        title="Single"
        summary="Opening a panel closes the one that was open. Selecting the open trigger closes it."
        code={`<Accordion type="single" defaultValue="single">
  <AccordionItem value="single">
    <AccordionTrigger>Single panel</AccordionTrigger>
    <AccordionContent>Selecting the trigger again closes it.</AccordionContent>
  </AccordionItem>
  <AccordionItem value="replacement">
    <AccordionTrigger>Replacement panel</AccordionTrigger>
    <AccordionContent>Opening this panel closes the previous one.</AccordionContent>
  </AccordionItem>
</Accordion>`}
      >
        <Accordion type="single" defaultValue="single">
          <AccordionItem value="single">
            <AccordionTrigger>Single collapsible panel</AccordionTrigger>
            <AccordionContent>
              Single mode closes the current panel when its trigger is selected
              again.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="replacement">
            <AccordionTrigger>Replacement panel</AccordionTrigger>
            <AccordionContent>
              Opening this panel closes the previous single-mode panel.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Example>

      <Example
        title="Rounded"
        summary="rounded curves the first trigger and the last panel, not only the outer clip."
        code={`<Accordion type="single" rounded border={false}>
  <AccordionItem value="one">
    <AccordionTrigger>Rounded trigger</AccordionTrigger>
    <AccordionContent>The panel follows the same radius.</AccordionContent>
  </AccordionItem>
</Accordion>`}
      >
        <Accordion type="single" rounded defaultValue="one">
          <AccordionItem value="one">
            <AccordionTrigger>Rounded trigger</AccordionTrigger>
            <AccordionContent>
              The panel follows the same radius.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="two">
            <AccordionTrigger>Second trigger</AccordionTrigger>
            <AccordionContent>
              The last panel is rounded at the bottom.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Example>

      <ComponentNotes {...accordionNotes} />
    </Container>
  );
}
