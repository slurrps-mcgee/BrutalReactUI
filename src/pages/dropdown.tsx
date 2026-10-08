import {
  CodeSnippet,
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "../../lib/main";

const code = `<Dropdown>
  <DropdownToggle variant="primary" rounded>Standalone</DropdownToggle>
  <DropdownMenu animate border rounded>
    <DropdownItem href="#/badges">Badges</DropdownItem>
    <DropdownItem disabled>Disabled</DropdownItem>
  </DropdownMenu>
</Dropdown>`;

export default function DropdownPage() {
  return (
    <Container title="Dropdown" fullWidth>
      <p className="max-w-xl font-sans">
        A dropdown in a nav item keeps the bar&apos;s shadow. On its own, the
        menu carries the hard shadow. Its border draws first, then the menu pops
        out. The toggle lifts and turns its caret down while the menu is open.
      </p>
      <Dropdown>
        <DropdownToggle variant="primary" rounded>
          Standalone
        </DropdownToggle>
        <DropdownMenu animate border rounded>
          <DropdownItem href="#/badges">Badges</DropdownItem>
          <DropdownItem href="#/buttons">Buttons</DropdownItem>
          <DropdownItem disabled>Disabled</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Dropdown>
        <DropdownToggle variant="secondary">
          Static
        </DropdownToggle>
        <DropdownMenu animate={false} border>
          <DropdownItem href="#/cards">Cards</DropdownItem>
          <DropdownItem href="#/links">Links</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <CodeSnippet code={code} language="tsx" rounded />
    </Container>
  );
}
