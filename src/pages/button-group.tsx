import { useState } from "react";
import { ButtonGroup, ButtonGroupItem, Container } from "../../lib/main";
import { buttonGroupNotes } from "./component-notes";
import { ComponentNotes, Example } from "./shared";

export default function ButtonGroupPage() {
  const [alignment, setAlignment] = useState("left");
  const [action, setAction] = useState("one");
  const [formats, setFormats] = useState<string[]>(["bold"]);

  return (
    <Container title="Button Group" fullWidth animate="scroll" rounded>
      <p className="max-w-2xl font-sans">
        Button groups join related actions. selectionMode chooses whether the
        group tracks one value, many values, or none.
      </p>

      <Example
        title="Single selection"
        summary="selectionMode single keeps one pressed item. value and onValueChange control it."
        code={`<ButtonGroup
  selectionMode="single"
  value={alignment}
  onValueChange={(value) => setAlignment(value as string)}
>
  <ButtonGroupItem value="left">Left</ButtonGroupItem>
  <ButtonGroupItem value="center">Center</ButtonGroupItem>
  <ButtonGroupItem value="right">Right</ButtonGroupItem>
</ButtonGroup>`}
      >
        <div className="grid gap-2">
          <span className="font-mono text-sm font-bold uppercase">
            Alignment: {alignment}
          </span>
          <ButtonGroup
            selectionMode="single"
            value={alignment}
            onValueChange={(value) => setAlignment(value as string)}
            rounded
            aria-label="Text alignment"
          >
            <ButtonGroupItem value="left">Left</ButtonGroupItem>
            <ButtonGroupItem value="center">Center</ButtonGroupItem>
            <ButtonGroupItem value="right">Right</ButtonGroupItem>
            <ButtonGroupItem value="justify" disabled>
              Justify
            </ButtonGroupItem>
          </ButtonGroup>
        </div>
      </Example>

      <Example
        title="Vertical"
        summary="orientation vertical stacks the items and joins their top and bottom borders."
        code={`<ButtonGroup
  orientation="vertical"
  selectionMode="single"
  value={action}
  onValueChange={(value) => setAction(value as string)}
>
  <ButtonGroupItem value="one" variant="outline">One</ButtonGroupItem>
  <ButtonGroupItem value="two" variant="outline">Two</ButtonGroupItem>
</ButtonGroup>`}
      >
        <div className="grid gap-2">
          <span className="font-mono text-sm font-bold uppercase">
            Action: {action}
          </span>
          <ButtonGroup
            orientation="vertical"
            selectionMode="single"
            value={action}
            onValueChange={(value) => setAction(value as string)}
            rounded
            aria-label="Vertical actions"
          >
            <ButtonGroupItem value="one" variant="outline">
              One
            </ButtonGroupItem>
            <ButtonGroupItem value="two" variant="outline">
              Two
            </ButtonGroupItem>
            <ButtonGroupItem value="three" variant="outline">
              Three
            </ButtonGroupItem>
          </ButtonGroup>
        </div>
      </Example>

      <Example
        title="Multiple selection"
        summary="selectionMode multiple stores an array. An item toggles in and out of the list."
        code={`<ButtonGroup
  selectionMode="multiple"
  value={formats}
  onValueChange={(value) => setFormats(value as string[])}
>
  <ButtonGroupItem value="bold">Bold</ButtonGroupItem>
  <ButtonGroupItem value="italic">Italic</ButtonGroupItem>
</ButtonGroup>`}
      >
        <div className="grid gap-2">
          <span className="font-mono text-sm font-bold uppercase">
            Formats: {formats.join(", ") || "none"}
          </span>
          <ButtonGroup
            selectionMode="multiple"
            value={formats}
            onValueChange={(value) => setFormats(value as string[])}
            aria-label="Text formatting"
          >
            <ButtonGroupItem value="bold">Bold</ButtonGroupItem>
            <ButtonGroupItem value="italic">Italic</ButtonGroupItem>
            <ButtonGroupItem value="underline">Underline</ButtonGroupItem>
          </ButtonGroup>
        </div>
      </Example>

      <Example
        title="Flat and borderless"
        summary="shadow false removes the group offset. border false removes the strokes on the items."
        code={`<ButtonGroup shadow={false}>
  <ButtonGroupItem value="one">One</ButtonGroupItem>
  <ButtonGroupItem value="two">Two</ButtonGroupItem>
</ButtonGroup>
<ButtonGroup border={false} rounded>
  <ButtonGroupItem value="one">One</ButtonGroupItem>
  <ButtonGroupItem value="two">Two</ButtonGroupItem>
</ButtonGroup>`}
      >
        <ButtonGroup shadow={false} aria-label="Flat group">
          <ButtonGroupItem value="one">One</ButtonGroupItem>
          <ButtonGroupItem value="two">Two</ButtonGroupItem>
        </ButtonGroup>
        <ButtonGroup border={false} rounded aria-label="Borderless group">
          <ButtonGroupItem value="one">One</ButtonGroupItem>
          <ButtonGroupItem value="two">Two</ButtonGroupItem>
        </ButtonGroup>
      </Example>

      <ComponentNotes {...buttonGroupNotes} />
    </Container>
  );
}
