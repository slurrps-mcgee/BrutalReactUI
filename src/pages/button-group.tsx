import { useState } from "react";
import {
  ButtonGroup,
  ButtonGroupItem,
  CodeSnippet,
  Container,
} from "../../lib/main";

const code = `<ButtonGroup
  selectionMode="single"
  value={alignment}
  onValueChange={(value) => setAlignment(value as string)}
>
  <ButtonGroupItem value="left">Left</ButtonGroupItem>
  <ButtonGroupItem value="center">Center</ButtonGroupItem>
  <ButtonGroupItem value="right">Right</ButtonGroupItem>
</ButtonGroup>`;

export default function ButtonGroupPage() {
  const [alignment, setAlignment] = useState("left");

  return (
    <Container title="Button Group" fullWidth animate="scroll" rounded>
      <div className="flex flex-wrap items-start gap-8">
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
            <ButtonGroupItem value="center" variant="secondary">
              Center
            </ButtonGroupItem>
            <ButtonGroupItem value="right">Right</ButtonGroupItem>
            <ButtonGroupItem value="justify" disabled>
              Justify
            </ButtonGroupItem>
          </ButtonGroup>
        </div>
        <ButtonGroup orientation="vertical" aria-label="Vertical actions">
          <ButtonGroupItem value="one" variant="primary">
            One
          </ButtonGroupItem>
          <ButtonGroupItem value="two" variant="outline">
            Two
          </ButtonGroupItem>
          <ButtonGroupItem value="three" variant="secondary">
            Three
          </ButtonGroupItem>
        </ButtonGroup>
      </div>
      <CodeSnippet code={code} language="tsx" rounded />
    </Container>
  );
}
