import { useState } from "react";
import { Send } from "lucide-react";
import { Button, Container } from "../../lib/main";
import { buttonNotes } from "./component-notes";
import { ComponentNotes, Example } from "./shared";

export default function ButtonsPage() {
  const [presses, setPresses] = useState(0);

  return (
    <Container title="Buttons" fullWidth animate="scroll" rounded>
      <p className="max-w-2xl font-sans">
        Use Button for an action. The shadow sits on a wrapper and the stroke
        sits on the face, so a pop never leaves the border behind the offset.
      </p>

      <Example
        title="Variants"
        summary="Primary is the default. Secondary and outline are the other faces."
        code={`<Button>Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>`}
      >
        <div className="flex flex-wrap items-center gap-4">
          <Button onClick={() => setPresses((count) => count + 1)}>
            Pressed {presses}
          </Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
        </div>
      </Example>

      <Example
        title="Sizes"
        summary="Small, medium, and large change the padding and the type size. Medium is the default."
        code={`<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`}
      >
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </Example>

      <Example
        title="Disabled"
        summary="A disabled button keeps its label readable and ignores clicks."
        code={`<Button disabled>Disabled</Button>
<Button variant="outline" disabled>Outline</Button>`}
      >
        <div className="flex flex-wrap items-center gap-4">
          <Button disabled>Disabled</Button>
          <Button variant="secondary" disabled>
            Secondary
          </Button>
          <Button variant="outline" disabled>
            Outline
          </Button>
        </div>
      </Example>

      <Example
        title="Full width"
        summary="fullWidth stretches the wrapper to the parent."
        code={`<Button fullWidth variant="secondary">Full width</Button>`}
      >
        <Button fullWidth variant="secondary">
          Full width
        </Button>
      </Example>

      <Example
        title="Icons and animation"
        summary="Pass animate to draw the border and pop the face. rounded uses the library radius. An icon can stand alone."
        code={`<Button animate rounded>Save</Button>
<Button animate rounded aria-label="Send">
  <Send />
</Button>`}
      >
        <div className="flex flex-wrap items-center gap-4">
          <Button animate rounded>
            Save
          </Button>
          <Button animate rounded aria-label="Send">
            <Send />
          </Button>
          <Button shadow={false} variant="outline">
            Flat
          </Button>
        </div>
      </Example>

      <ComponentNotes {...buttonNotes} />
    </Container>
  );
}
