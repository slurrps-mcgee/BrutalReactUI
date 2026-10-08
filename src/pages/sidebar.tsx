import { useState } from "react";
import { Award, Library, PanelLeft, Square } from "lucide-react";
import {
  Button,
  CodeSnippet,
  Container,
  Nav,
  NavGroup,
  NavItem,
  NavLink,
  Offcanvas,
  Sidebar,
} from "../../lib/main";

export default function SidebarPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  const icon = "size-4 shrink-0";

  return (
    <Container title="Sidebar" fullWidth>
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
      <Sidebar
        variant="secondary"
        shadow={false}
        className="w-72"
        wrapperClassName="w-72"
      >
        <p className="font-display text-xl">Static sidebar</p>
        <Nav direction="column">
          <NavItem rounded>
            <NavLink href="#/sidebar" active icon={<PanelLeft className={icon} />}>
              Sidebar
            </NavLink>
          </NavItem>
        </Nav>
      </Sidebar>
      <Button onClick={() => setOpen(true)}>Open offcanvas</Button>
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
      <CodeSnippet
        language="tsx"
        code={`<Sidebar collapsed={collapsed} animate="scroll" rounded>
  <NavLink href="#/sidebar" icon={<PanelLeft />} active>Sidebar</NavLink>
  <NavGroup label="Library" icon={<Library />}>...</NavGroup>
</Sidebar>`}
      />
    </Container>
  );
}
