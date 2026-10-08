import { useState } from "react";
import {
  CodeSnippet,
  Container,
  ListGroup,
  ListGroupButton,
  ListGroupItem,
  ListGroupLink,
} from "../../lib/main";

const code = `<ListGroup variant="outline" animate="scroll" rounded>
  <ListGroupItem>Static item</ListGroupItem>
  <ListGroupButton active>Button item</ListGroupButton>
  <ListGroupLink href="#docs">Link item</ListGroupLink>
</ListGroup>`;

export default function ListGroupPage() {
  const [selected, setSelected] = useState("Inbox");

  return (
    <Container title="List Group" fullWidth animate="scroll" rounded>
      <div className="grid gap-6 md:grid-cols-2">
        <ListGroup
          variant="outline"
          animate="scroll"
          rounded
          aria-label="Mailbox folders"
        >
          {["Inbox", "Starred", "Archive"].map((item) => (
            <ListGroupButton
              key={item}
              active={selected === item}
              onClick={() => setSelected(item)}
            >
              {item}
            </ListGroupButton>
          ))}
          <ListGroupButton disabled>Trash (disabled)</ListGroupButton>
        </ListGroup>
        <ListGroup variant="secondary" size="lg" aria-label="Resources">
          <ListGroupItem>Selected: {selected}</ListGroupItem>
          <ListGroupLink href="#guide">Guide</ListGroupLink>
          <ListGroupLink disabled>Private docs</ListGroupLink>
        </ListGroup>
      </div>
      <CodeSnippet code={code} language="tsx" rounded />
    </Container>
  );
}
