import { useState } from "react";
import {
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
  NavLink,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  Toggler,
  type TogglerAnimation,
} from "../../lib/main";
import { navbarNotes } from "./component-notes";
import { ComponentNotes, Example } from "./shared";

const togglerAnimations: TogglerAnimation[] = [
  "normal",
  "spin",
  "rotate-counterclockwise",
  "rotate-clockwise",
  "arrow-left",
  "arrow-right",
  "arrow-up",
  "arrow-down",
];

function AnimatedToggler({ animation }: { animation: TogglerAnimation }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col items-center gap-2">
      <Toggler
        expanded={expanded}
        iconAnimation={animation}
        animate="scroll"
        rounded
        aria-label={`Toggle ${animation} animation`}
        onClick={() => setExpanded((value) => !value)}
      />
      <span className="font-mono text-xs font-bold">{animation}</span>
    </div>
  );
}

export default function NavbarPage() {
  const [open, setOpen] = useState(false);

  return (
    <Container title="Navbar" fullWidth>
      <p className="max-w-2xl font-sans">
        A navbar holds a brand, links, and an optional menu. On a narrow screen
        the toggler opens the collapse.
      </p>

      <Example
        imports="Navbar, NavbarBrand, Toggler, NavbarCollapse, Nav, NavItem, NavLink, Dropdown, DropdownToggle, DropdownMenu, DropdownItem"
        title="Collapsible bar"
        summary="The toggler controls NavbarCollapse. An open dropdown in the bar paints above the content that follows."
        code={`<Navbar variant="primary" animate="scroll" rounded>
  <NavbarBrand href="#/">Brutal</NavbarBrand>
  <Toggler expanded={open} controls="navbar-demo" onClick={() => setOpen(!open)} />
  <NavbarCollapse id="navbar-demo" open={open}>
    <Nav>
      <NavItem>
        <NavLink href="#/navbar" active>Active</NavLink>
      </NavItem>
      <NavItem>
        <Dropdown>
          <DropdownToggle>More</DropdownToggle>
          <DropdownMenu>
            <DropdownItem href="#/cards">Cards</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavItem>
    </Nav>
  </NavbarCollapse>
</Navbar>`}
      >
        <Navbar variant="primary" animate="scroll" rounded>
          <NavbarBrand href="#/">Brutal</NavbarBrand>
          <Toggler
            expanded={open}
            controls="navbar-demo"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation"
          />
          <NavbarCollapse id="navbar-demo" open={open}>
            <Nav>
              <NavItem>
                <NavLink href="#/navbar" active>
                  Active
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#/buttons">Buttons</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#/badges" disabled>
                  Disabled
                </NavLink>
              </NavItem>
              <NavItem>
                <Dropdown>
                  <DropdownToggle>More</DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem href="#/cards">Cards</DropdownItem>
                    <DropdownItem href="#/links">Links</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </NavItem>
            </Nav>
          </NavbarCollapse>
        </Navbar>
      </Example>

      <Example
        imports="Navbar, NavbarBrand, Nav, NavItem, NavLink"
        title="Static bar"
        summary="Leave the toggler off when the links always fit. rounded on a nav item rounds that link."
        code={`<Navbar variant="secondary">
  <NavbarBrand href="#/">Static navbar</NavbarBrand>
  <Nav>
    <NavItem rounded>
      <NavLink href="#/navbar" active>Active</NavLink>
    </NavItem>
    <NavItem rounded>
      <NavLink href="#/buttons">Buttons</NavLink>
    </NavItem>
  </Nav>
</Navbar>`}
      >
        <Navbar variant="secondary">
          <NavbarBrand href="#/">Static navbar</NavbarBrand>
          <Nav>
            <NavItem rounded>
              <NavLink href="#/navbar" active>
                Active
              </NavLink>
            </NavItem>
            <NavItem rounded>
              <NavLink href="#/buttons">Buttons</NavLink>
            </NavItem>
          </Nav>
        </Navbar>
      </Example>

      <Example
        imports="Toggler"
        title="Toggler animations"
        summary="iconAnimation changes how the icon moves when the toggler opens."
        code={`<Toggler expanded={expanded} iconAnimation="spin" onClick={() => setExpanded(!expanded)} />`}
      >
        <div className="flex flex-wrap gap-6">
          {togglerAnimations.map((animation) => (
            <AnimatedToggler key={animation} animation={animation} />
          ))}
        </div>
      </Example>

      <Example
        imports="Navbar, NavbarBrand, Dropdown, DropdownToggle, DropdownMenu, DropdownItem"
        title="Flat bar"
        summary="shadow false removes the offset. The menu shows a normal border unless that menu passes animate."
        code={`<Navbar shadow={false}>
  <NavbarBrand href="#/">Flat</NavbarBrand>
  <Dropdown>
    <DropdownToggle>More</DropdownToggle>
    <DropdownMenu>
      <DropdownItem href="#/buttons">Buttons</DropdownItem>
    </DropdownMenu>
  </Dropdown>
</Navbar>`}
      >
        <Navbar shadow={false}>
          <NavbarBrand href="#/">Flat</NavbarBrand>
          <Dropdown>
            <DropdownToggle>More</DropdownToggle>
            <DropdownMenu>
              <DropdownItem href="#/buttons">Buttons</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Navbar>
      </Example>

      <ComponentNotes {...navbarNotes} />
    </Container>
  );
}
