import { useState } from "react";
import {
  Container,
  ListGroup,
  ListGroupButton,
  ListGroupItem,
  ListGroupLink,
} from "../../lib/main";
import { listGroupNotes } from "./component-notes";
import { ComponentNotes, Example } from "./shared";

export default function ListGroupPage() {
  const [selected, setSelected] = useState("Inbox");

  return (
    <Container title="List Group" fullWidth animate="scroll" rounded>
      <p className="max-w-2xl font-sans">
        List groups stack related rows. Items can be static text, buttons, or
        links.
      </p>

      <Example
        title="Actionable items"
        summary="ListGroupButton sets active on the chosen row. disabled blocks a row."
        code={`<ListGroup variant="outline" rounded wrapperClassName="max-w-md" aria-label="Mailbox folders">
  <ListGroupButton active>Inbox</ListGroupButton>
  <ListGroupButton disabled>Trash</ListGroupButton>
</ListGroup>`}
      >
        <ListGroup
          variant="outline"
          rounded
          aria-label="Mailbox folders"
          wrapperClassName="max-w-md"
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
        <p className="font-mono text-sm">
          Selected: <strong>{selected}</strong>
        </p>
      </Example>

      <Example
        title="Links and static rows"
        summary="ListGroupItem is plain text. ListGroupLink navigates. size changes the row padding."
        code={`<ListGroup variant="secondary" size="lg" wrapperClassName="max-w-md">
  <ListGroupItem>Static item</ListGroupItem>
  <ListGroupLink href="#guide">Guide</ListGroupLink>
  <ListGroupLink disabled>Private docs</ListGroupLink>
</ListGroup>`}
      >
        <ListGroup
          variant="secondary"
          size="lg"
          aria-label="Resources"
          wrapperClassName="max-w-md"
        >
          <ListGroupItem>Static item</ListGroupItem>
          <ListGroupLink href="#guide">Guide</ListGroupLink>
          <ListGroupLink disabled>Private docs</ListGroupLink>
        </ListGroup>
      </Example>

      <Example
        title="Animation"
        summary="animate draws the outer stroke, then pops the list. The rows stay flush with each other."
        code={`<ListGroup animate="scroll" rounded wrapperClassName="max-w-md">
  <ListGroupItem>First</ListGroupItem>
  <ListGroupItem>Second</ListGroupItem>
</ListGroup>`}
      >
        <ListGroup animate="scroll" rounded wrapperClassName="max-w-md">
          <ListGroupItem>First</ListGroupItem>
          <ListGroupItem>Second</ListGroupItem>
          <ListGroupItem>Third</ListGroupItem>
        </ListGroup>
      </Example>

      <Example
        title="Flat and borderless"
        summary="shadow false removes the offset. border false removes the outer stroke and the row rules."
        code={`<ListGroup shadow={false} wrapperClassName="max-w-md">
  <ListGroupItem>Flat</ListGroupItem>
</ListGroup>
<ListGroup border={false} rounded wrapperClassName="max-w-md">
  <ListGroupItem>No stroke</ListGroupItem>
</ListGroup>`}
      >
        <ListGroup shadow={false} wrapperClassName="max-w-md">
          <ListGroupItem>Flat row</ListGroupItem>
          <ListGroupItem>Still flat</ListGroupItem>
        </ListGroup>
        <ListGroup border={false} rounded wrapperClassName="max-w-md">
          <ListGroupItem>No stroke</ListGroupItem>
          <ListGroupItem>No row rule</ListGroupItem>
        </ListGroup>
      </Example>

      <ComponentNotes {...listGroupNotes} />
    </Container>
  );
}
