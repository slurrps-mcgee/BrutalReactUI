import { useState } from "react";
import { Award, Library, PanelLeft, Square } from "lucide-react";
import {
  Button,
  Container,
  Nav,
  NavGroup,
  NavItem,
  NavLink,
  Offcanvas,
  Sidebar,
} from "../../lib/main";
import { sidebarNotes } from "./component-notes";
import { ComponentNotes, Example } from "./shared";

export default function SidebarPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  const icon = "size-4 shrink-0";

  return (
    <Container title="Sidebar" fullWidth>
      <p className="max-w-2xl font-sans">
        A sidebar holds a vertical nav. Collapsed, each item shows its icon and
        the group flyout opens beside the rail.
      </p>

      <Example
        imports="Sidebar, Nav, NavItem, NavLink, NavGroup"
        title="Collapsible rail"
        summary="collapsed hides the labels. The active link keeps its shadow flush with the face."
        code={`import { Award, Library, PanelLeft } from "lucide-react";

<Sidebar collapsed={collapsed} animate="scroll" rounded>
  <Nav direction="column">
    <NavItem rounded>
      <NavLink href="#/sidebar" active icon={<PanelLeft />}>
        Sidebar
      </NavLink>
    </NavItem>
    <NavGroup label="Library" icon={<Library />} defaultOpen>
      <NavItem>
        <NavLink href="#/badges" icon={<Award />}>Badges</NavLink>
      </NavItem>
    </NavGroup>
  </Nav>
</Sidebar>`}
      >
        <Sidebar
          collapsed={collapsed}
          animate="scroll"
          rounded
          className={collapsed ? "w-20" : "w-72"}
          wrapperClassName={collapsed ? "w-20" : "w-72"}
        >
          <button
            type="button"
            className="inline-flex items-center gap-2 border-[3px] border-border bg-[var(--surface)] px-3 py-2 font-mono text-sm font-bold uppercase"
            aria-expanded={!collapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setCollapsed((value) => !value)}
          >
            <PanelLeft className={icon} aria-hidden="true" />
            <span className={collapsed ? "sr-only" : undefined}>Collapse</span>
          </button>
          <Nav direction="column">
            <NavItem rounded>
              <NavLink
                href="#/sidebar"
                active
                icon={<PanelLeft className={icon} />}
              >
                Sidebar
              </NavLink>
            </NavItem>
            <NavGroup
              label="Library"
              icon={<Library className={icon} />}
              defaultOpen
            >
              <NavItem>
                <NavLink href="#/badges" icon={<Award className={icon} />}>
                  Badges
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#/buttons" icon={<Square className={icon} />}>
                  Buttons
                </NavLink>
              </NavItem>
            </NavGroup>
          </Nav>
        </Sidebar>
      </Example>

      <Example
        imports="Sidebar, Nav, NavItem, NavLink"
        title="Static sidebar"
        summary="shadow false leaves a flat rail. variant secondary changes the face."
        code={`<Sidebar variant="secondary" shadow={false}>
  <Nav direction="column">
    <NavItem rounded>
      <NavLink href="#/sidebar" active>Sidebar</NavLink>
    </NavItem>
  </Nav>
</Sidebar>`}
      >
        <Sidebar
          variant="secondary"
          shadow={false}
          className="w-72"
          wrapperClassName="w-72"
        >
          <p className="font-display text-xl">Static sidebar</p>
          <Nav direction="column">
            <NavItem rounded>
              <NavLink
                href="#/sidebar"
                active
                icon={<PanelLeft className={icon} />}
              >
                Sidebar
              </NavLink>
            </NavItem>
          </Nav>
        </Sidebar>
      </Example>

      <Example
        imports="Button, Offcanvas, Nav, NavItem, NavLink"
        title="Offcanvas"
        summary="Offcanvas slides in over the page. onClose runs from the scrim and from Escape."
        code={`<Button onClick={() => setOpen(true)}>Open offcanvas</Button>
<Offcanvas open={open} onClose={() => setOpen(false)} variant="outline">
  <Nav direction="column">
    <NavItem>
      <NavLink href="#/" onClick={() => setOpen(false)}>Home</NavLink>
    </NavItem>
  </Nav>
</Offcanvas>`}
      >
        <Button className="self-start" onClick={() => setOpen(true)}>
          Open offcanvas
        </Button>
        <Offcanvas open={open} onClose={() => setOpen(false)} variant="outline">
          <p className="font-display text-xl">Offcanvas</p>
          <Nav direction="column">
            <NavItem>
              <NavLink
                href="#/"
                onClick={() => setOpen(false)}
                icon={<PanelLeft className={icon} />}
              >
                Home
              </NavLink>
            </NavItem>
          </Nav>
        </Offcanvas>
      </Example>

      <ComponentNotes {...sidebarNotes} />
    </Container>
  );
}
