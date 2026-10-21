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
    <Container title="Dropdown" fluid>
      <p className="max-w-2xl font-sans">
        A dropdown pairs a toggle with a menu. The menu closes on outside click
        and on Escape, and returns focus to the toggle.
      </p>

      <Example
        imports="Dropdown, DropdownToggle, DropdownMenu, DropdownItem"
        title="Animated toggle"
        summary="animate, rounded, shadow, and border on Dropdown apply to the toggle and the menu. scroll waits until the control enters the viewport."
        code={`<Dropdown animate="scroll" rounded>
  <DropdownToggle variant="primary">Entrance</DropdownToggle>
  <DropdownMenu>
    <DropdownItem href="#/badges">Badges</DropdownItem>
    <DropdownItem href="#/buttons">Buttons</DropdownItem>
  </DropdownMenu>
</Dropdown>`}
      >
        <Dropdown animate="scroll" rounded>
          <DropdownToggle variant="primary">
            Entrance
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem href="#/badges">Badges</DropdownItem>
            <DropdownItem href="#/buttons">Buttons</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Example>

      <Example
        imports="Dropdown, DropdownToggle, DropdownMenu, DropdownItem"
        title="Animated menu"
        summary="animate on Dropdown draws the toggle, then draws the menu and pops it out when it opens. The toggle presses into its shadow and turns its caret."
        code={`<Dropdown animate rounded>
  <DropdownToggle variant="primary">Standalone</DropdownToggle>
  <DropdownMenu>
    <DropdownItem href="#/badges">Badges</DropdownItem>
    <DropdownItem href="#/buttons">Buttons</DropdownItem>
    <DropdownItem disabled>Disabled</DropdownItem>
  </DropdownMenu>
</Dropdown>`}
      >
        <Dropdown animate rounded>
          <DropdownToggle variant="primary">
            Standalone
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem href="#/badges">Badges</DropdownItem>
            <DropdownItem href="#/buttons">Buttons</DropdownItem>
            <DropdownItem disabled>Disabled</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Example>

      <Example
        imports="Dropdown, DropdownToggle, DropdownMenu, DropdownItem"
        title="Static menu"
        summary="animate false opens the menu without the draw or the pop. The toggle still presses into its shadow."
        code={`<Dropdown>
  <DropdownToggle variant="secondary">Static</DropdownToggle>
  <DropdownMenu>
    <DropdownItem href="#/cards">Cards</DropdownItem>
    <DropdownItem href="#/links">Links</DropdownItem>
  </DropdownMenu>
</Dropdown>`}
      >
        <Dropdown>
          <DropdownToggle variant="secondary">Static</DropdownToggle>
          <DropdownMenu>
            <DropdownItem href="#/cards">Cards</DropdownItem>
            <DropdownItem href="#/links">Links</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Example>

      <Example
        imports="Dropdown, DropdownToggle, DropdownMenu, DropdownItem"
        title="Disabled and borderless"
        summary="disabled blocks the toggle. border false removes the toggle stroke and the menu stroke. border on the toggle puts that stroke back."
        code={`<Dropdown disabled>
  <DropdownToggle>Unavailable</DropdownToggle>
  <DropdownMenu>
    <DropdownItem href="#/modal">Modal</DropdownItem>
  </DropdownMenu>
</Dropdown>
<Dropdown border={false} shadow={false} rounded>
  <DropdownToggle variant="outline" border>No border</DropdownToggle>
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
          <Dropdown border={false} shadow={false} rounded>
            <DropdownToggle variant="outline" border>
              No border
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem href="#/toast">Toast</DropdownItem>
              <DropdownItem href="#/tooltip">Tooltip</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </Example>

      <Example
        imports="Dropdown, DropdownToggle, DropdownMenu, DropdownItem"
        title="Menu alignment"
        summary="align left hangs the menu from the toggle's left edge. align right hangs it from the right edge, so a control at the end of the row stays on the page."
        code={`<Dropdown>
  <DropdownToggle>Left</DropdownToggle>
  <DropdownMenu align="left">
    <DropdownItem href="#/buttons">Buttons</DropdownItem>
  </DropdownMenu>
</Dropdown>
<Dropdown>
  <DropdownToggle>Right</DropdownToggle>
  <DropdownMenu align="right">
    <DropdownItem href="#/cards">Cards</DropdownItem>
  </DropdownMenu>
</Dropdown>`}
      >
        <div className="flex w-full items-start justify-between gap-4">
          <Dropdown>
            <DropdownToggle>Left</DropdownToggle>
            <DropdownMenu align="left">
              <DropdownItem href="#/buttons">Buttons</DropdownItem>
              <DropdownItem href="#/cards">Cards</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Dropdown>
            <DropdownToggle>Right</DropdownToggle>
            <DropdownMenu align="right">
              <DropdownItem href="#/buttons">Buttons</DropdownItem>
              <DropdownItem href="#/cards">Cards</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </Example>

      <Example
        imports="Dropdown, DropdownToggle, DropdownMenu, DropdownItem"
        title="Full width"
        summary="fluid stretches the toggle and the menu across the parent, the same way it does on a button."
        code={`<Dropdown fluid>
  <DropdownToggle>Wide</DropdownToggle>
  <DropdownMenu>
    <DropdownItem href="#/buttons">Buttons</DropdownItem>
  </DropdownMenu>
</Dropdown>`}
      >
        <Dropdown fluid>
          <DropdownToggle>Wide</DropdownToggle>
          <DropdownMenu>
            <DropdownItem href="#/buttons">Buttons</DropdownItem>
            <DropdownItem href="#/cards">Cards</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Example>

      <Example
        imports="Dropdown, DropdownToggle, DropdownMenu, DropdownItem"
        title="Flat"
        summary="shadow false removes the offset from the toggle and from the menu."
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
