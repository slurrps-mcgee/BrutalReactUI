import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  CodeSnippet,
  Container,
} from "../../lib/main";

const code = `<Accordion type="multiple" defaultValue={["keyboard"]} rounded>
  <AccordionItem value="keyboard">
    <AccordionTrigger>Keyboard support</AccordionTrigger>
    <AccordionContent>Use arrows, Home, and End between triggers.</AccordionContent>
  </AccordionItem>
</Accordion>`;

export default function AccordionPage() {
  return (
    <Container title="Accordion" fullWidth animate="scroll" rounded>
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
      <CodeSnippet code={code} language="tsx" rounded />
    </Container>
  );
}
