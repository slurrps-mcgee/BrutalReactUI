import { useState } from "react";
import {
  CodeSnippet,
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
      <Navbar
        variant="primary"
        animate="scroll"
        rounded
      >
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
      <section className="flex flex-col gap-4">
        <h3 className="font-display text-xl font-bold">Toggler animations</h3>
        <div className="flex flex-wrap gap-6">
          {togglerAnimations.map((animation) => (
            <AnimatedToggler key={animation} animation={animation} />
          ))}
        </div>
      </section>
      <CodeSnippet
        language="tsx"
        code={`<Navbar variant="primary" animate="scroll" rounded>
  <NavbarBrand href="#/">Brutal</NavbarBrand>
  <Toggler expanded={open} controls="navbar-demo" />
  <NavbarCollapse id="navbar-demo" open={open}>
    <Nav>
      <NavItem><NavLink href="#/navbar" active>Active</NavLink></NavItem>
    </Nav>
  </NavbarCollapse>
</Navbar>`}
      />
    </Container>
  );
}
