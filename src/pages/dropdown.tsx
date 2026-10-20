import {
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "../../lib/main";
import { dropdownNotes } from "./component-notes";
import { ComponentNotes, Example } from "./shared";

export default function DropdownPage() {
  return (
    <Container title="Dropdown" fullWidth>
      <p className="max-w-2xl font-sans">
        A dropdown pairs a toggle with a menu. The menu closes on outside click
        and on Escape, and returns focus to the toggle.
      </p>

      <Example
        imports="Dropdown, DropdownToggle, DropdownMenu, DropdownItem"
        title="Animated menu"
        summary="animate draws the menu border, then pops it open. The toggle lifts and turns its caret while the menu is open."
        code={`<Dropdown shadow>
  <DropdownToggle variant="primary" rounded>Standalone</DropdownToggle>
  <DropdownMenu animate border rounded>
    <DropdownItem href="#/badges">Badges</DropdownItem>
    <DropdownItem href="#/buttons">Buttons</DropdownItem>
    <DropdownItem disabled>Disabled</DropdownItem>
  </DropdownMenu>
</Dropdown>`}
      >
        <Dropdown shadow>
          <DropdownToggle variant="primary" rounded>
            Standalone
          </DropdownToggle>
          <DropdownMenu animate border rounded>
            <DropdownItem href="#/badges">Badges</DropdownItem>
            <DropdownItem href="#/buttons">Buttons</DropdownItem>
            <DropdownItem disabled>Disabled</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Example>

      <Example
        imports="Dropdown, DropdownToggle, DropdownMenu, DropdownItem"
        title="Static menu"
        summary="animate false opens the menu without the draw or the pop."
        code={`<Dropdown>
  <DropdownToggle variant="secondary">Static</DropdownToggle>
  <DropdownMenu animate={false} border>
    <DropdownItem href="#/cards">Cards</DropdownItem>
    <DropdownItem href="#/links">Links</DropdownItem>
  </DropdownMenu>
</Dropdown>`}
      >
        <Dropdown>
          <DropdownToggle variant="secondary">Static</DropdownToggle>
          <DropdownMenu animate={false} border>
            <DropdownItem href="#/cards">Cards</DropdownItem>
            <DropdownItem href="#/links">Links</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Example>

      <Example
        imports="Dropdown, DropdownToggle, DropdownMenu, DropdownItem"
        title="Disabled and borderless"
        summary="disabled blocks the toggle. border false removes the toggle stroke and the menu stroke."
        code={`<Dropdown disabled>
  <DropdownToggle>Unavailable</DropdownToggle>
  <DropdownMenu>
    <DropdownItem href="#/modal">Modal</DropdownItem>
  </DropdownMenu>
</Dropdown>
<Dropdown border={false} shadow={false}>
  <DropdownToggle variant="outline">No border</DropdownToggle>
  <DropdownMenu>
    <DropdownItem href="#/toast">Toast</DropdownItem>
  </DropdownMenu>
</Dropdown>`}
      >
        <div className="flex flex-wrap gap-4">
          <Dropdown disabled>
            <DropdownToggle>Unavailable</DropdownToggle>
            <DropdownMenu>
              <DropdownItem href="#/modal">Modal</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Dropdown border={false} shadow={false}>
            <DropdownToggle variant="outline">No border</DropdownToggle>
            <DropdownMenu>
              <DropdownItem href="#/toast">Toast</DropdownItem>
              <DropdownItem href="#/tooltip">Tooltip</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </Example>

      <Example
        imports="Dropdown, DropdownToggle, DropdownMenu, DropdownItem"
        title="Flat"
        summary="shadow false keeps the toggle and the menu from lifting."
        code={`<Dropdown shadow={false}>
  <DropdownToggle>Flat</DropdownToggle>
  <DropdownMenu>
    <DropdownItem href="#/buttons">Buttons</DropdownItem>
  </DropdownMenu>
</Dropdown>`}
      >
        <Dropdown shadow={false}>
          <DropdownToggle>Flat</DropdownToggle>
          <DropdownMenu>
            <DropdownItem href="#/buttons">Buttons</DropdownItem>
            <DropdownItem href="#/cards">Cards</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Example>

      <ComponentNotes {...dropdownNotes} />
    </Container>
  );
}
