import { useState } from "react";
import { Send } from "lucide-react";
import { Button, CodeSnippet, Container } from "../../lib/main";

export default function ButtonsPage() {
  const [presses, setPresses] = useState(0);

  return (
    <Container title="Buttons" fullWidth animate="scroll" rounded>
      <div className="flex flex-wrap items-center gap-4">
        <Button onClick={() => setPresses((count) => count + 1)}>
          Pressed {presses}
        </Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button size="sm">Small</Button>
        <Button size="lg" animate rounded>
          Large
        </Button>
        <Button disabled>Disabled</Button>
        <Button animate rounded>
          <Send />
        </Button>
      </div>
      <Button fullWidth variant="secondary">
        Full width
      </Button>
      <CodeSnippet
        language="tsx"
        code={`<Button>Pressed</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button size="sm">Small</Button>
<Button size="lg" animate rounded>Large</Button>
<Button disabled>Disabled</Button>
<Button fullWidth variant="secondary">Full width</Button>`}
      />
    </Container>
  );
}
