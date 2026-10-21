import { useState, type MouseEvent } from "react";
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
  ThemeToggle,
  Toggler,
  type TogglerAnimation,
} from "../../lib/main";
import { navbarNotes } from "./component-notes";
import { ComponentNotes, Example } from "./shared";

const routes = [
  { path: "/", label: "Home", body: "Home is the current page." },
  { path: "/about", label: "About", body: "About is the current page." },
  { path: "/library", label: "Library", body: "Library is the current page." },
] as const;

const routerNav = `import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Nav,
  NavItem,
  NavLink,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  Toggler,
} from "brutal-react-ui";

const routes = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/library", label: "Library" },
];

export function AppNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Navbar variant="outline">
      <NavbarBrand href="/">App</NavbarBrand>
      <Toggler
        expanded={open}
        controls="app-nav"
        onClick={() => setOpen((value) => !value)}
      />
      <NavbarCollapse id="app-nav" open={open}>
        <Nav>
          {routes.map((route) => (
            <NavItem key={route.path}>
              <NavLink
                href={route.path}
                active={pathname === route.path}
                onClick={(event) => {
                  event.preventDefault();
                  navigate(route.path);
                }}
              >
                {route.label}
              </NavLink>
            </NavItem>
          ))}
        </Nav>
      </NavbarCollapse>
    </Navbar>
  );
}`;

function ActiveRouteBar() {
  const [path, setPath] = useState<(typeof routes)[number]["path"]>("/");
  const [open, setOpen] = useState(false);
  const page = routes.find((route) => route.path === path) ?? routes[0];

  function go(
    event: MouseEvent<HTMLElement>,
    next: (typeof routes)[number]["path"],
  ) {
    event.preventDefault();
    setPath(next);
    setOpen(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <Navbar variant="outline">
        <NavbarBrand href="/" onClick={(event) => go(event, "/")}>
          App
        </NavbarBrand>
        <Toggler
          expanded={open}
          controls="route-nav"
          aria-label="Toggle route navigation"
          onClick={() => setOpen((value) => !value)}
        />
        <NavbarCollapse id="route-nav" open={open}>
          <Nav>
            {routes.map((route) => (
              <NavItem key={route.path}>
                <NavLink
                  href={route.path}
                  active={path === route.path}
                  onClick={(event) => go(event, route.path)}
                >
                  {route.label}
                </NavLink>
              </NavItem>
            ))}
          </Nav>
        </NavbarCollapse>
      </Navbar>
      <p className="font-sans">{page.body}</p>
    </div>
  );
}

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

function ThemeToggleSide() {
  const [open, setOpen] = useState(false);

  return (
    <Navbar variant="outline">
      <NavbarBrand href="#/navbar">Brutal</NavbarBrand>
      <div className="flex items-center gap-2">
        <ThemeToggle align="right" />
        <Toggler
          expanded={open}
          controls="toggle-side-nav"
          aria-label="Toggle navigation"
          onClick={() => setOpen((value) => !value)}
        />
      </div>
      <NavbarCollapse id="toggle-side-nav" open={open}>
        <Nav>
          <NavItem>
            <NavLink href="#/navbar" active>
              Home
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#/buttons">Buttons</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#/cards">Cards</NavLink>
          </NavItem>
        </Nav>
      </NavbarCollapse>
    </Navbar>
  );
}

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
    <Container title="Navbar" fluid>
      <p className="max-w-2xl font-sans">
        A navbar holds a brand, links, and an optional menu. On a narrow screen
        the toggler opens the collapse, and each link takes its own full-width
        row. The filled link is the current path.
        Compare that path to the router location and pass{" "}
        <span className="font-mono">active</span>.
      </p>

      <Example
        imports="Navbar, NavbarBrand, Toggler, NavbarCollapse, Nav, NavItem, NavLink"
        title="Active route"
        summary="Click a link. The face fills, the sentence changes, and the menu closes. The preview stores the path in state."
        code={`const [path, setPath] = useState("/");

<NavLink
  href={route.path}
  active={path === route.path}
  onClick={(event) => {
    event.preventDefault();
    setPath(route.path);
    setOpen(false);
  }}
>
  {route.label}
</NavLink>`}
      >
        <ActiveRouteBar />
      </Example>

      <section className="flex w-full flex-col gap-3">
        <h3 className="font-display text-2xl font-bold">With React Router</h3>
        <p className="max-w-2xl font-sans">
          <span className="font-mono">NavLink</span> is an anchor. It does not
          read the router. <span className="font-mono">active</span> is true
          when <span className="font-mono">pathname</span> equals the link.{" "}
          <span className="font-mono">navigate</span> keeps the click in the
          app, and the effect closes the menu after each change.
        </p>
        <CodeSnippet language="tsx" code={routerNav} />
      </section>

      <Example
        imports="Nav, NavItem, NavLink, Dropdown, DropdownToggle, DropdownMenu, DropdownItem"
        title="Animated items"
        summary="animate on a nav item draws that link, then pops it. animate on Dropdown draws the toggle and pops the menu when it opens. fluid spans the item. scroll waits until the item enters the viewport."
        code={`<Nav>
  <NavItem animate="scroll">
    <NavLink href="#/navbar">Home</NavLink>
  </NavItem>
  <NavItem animate="scroll">
    <NavLink href="#/buttons">Buttons</NavLink>
  </NavItem>
  <NavItem animate="scroll">
    <Dropdown animate="scroll" fluid>
      <DropdownToggle>More</DropdownToggle>
      <DropdownMenu>
        <DropdownItem href="#/cards">Cards</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </NavItem>
</Nav>`}
      >
        <Nav>
          <NavItem animate="scroll">
            <NavLink href="#/navbar">Home</NavLink>
          </NavItem>
          <NavItem animate="scroll">
            <NavLink href="#/buttons">Buttons</NavLink>
          </NavItem>
          <NavItem animate="scroll">
            <Dropdown animate="scroll" fluid>
              <DropdownToggle>More</DropdownToggle>
              <DropdownMenu>
                <DropdownItem href="#/cards">Cards</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavItem>
        </Nav>
      </Example>

      <Example
        imports="Navbar, NavbarBrand, Toggler, NavbarCollapse, Nav, NavItem, NavLink, Dropdown, DropdownToggle, DropdownMenu, DropdownItem"
        title="Collapsible bar"
        summary="rounded, shadow, border, and animate on the bar pass to the links, the dropdown, and the toggler. animate false and rounded false on one item keep that item still and square."
        code={`<Navbar variant="primary" animate="scroll" rounded>
  <NavbarBrand href="#/">Brutal</NavbarBrand>
  <Toggler expanded={open} controls="navbar-demo" onClick={() => setOpen(!open)} />
  <NavbarCollapse id="navbar-demo" open={open}>
    <Nav>
      <NavItem>
        <NavLink href="#/navbar" active>Active</NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="#/buttons">Buttons</NavLink>
      </NavItem>
      <NavItem animate={false} rounded={false}>
        <NavLink href="#/badges" disabled>Disabled</NavLink>
      </NavItem>
      <NavItem>
        <Dropdown fluid>
          <DropdownToggle>More</DropdownToggle>
          <DropdownMenu>
            <DropdownItem href="#/cards">Cards</DropdownItem>
            <DropdownItem href="#/links">Links</DropdownItem>
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
              <NavItem animate={false} rounded={false}>
                <NavLink href="#/badges" disabled>
                  Disabled
                </NavLink>
              </NavItem>
              <NavItem>
                <Dropdown fluid>
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
        imports="Navbar, NavbarBrand, ThemeToggle, Toggler, NavbarCollapse, Nav, NavItem, NavLink"
        title="Theme toggle beside the menu"
        summary="Keep ThemeToggle in the same cluster as Toggler. align right keeps its menu on the page. On a small screen, opening the menu stacks each link in its own full-width row."
        code={`<Navbar variant="outline">
  <NavbarBrand href="#/">Brutal</NavbarBrand>
  <div className="flex items-center gap-2">
    <ThemeToggle align="right" />
    <Toggler expanded={open} controls="nav" onClick={() => setOpen(!open)} />
  </div>
  <NavbarCollapse id="nav" open={open}>
    <Nav>
      <NavItem>
        <NavLink href="#/navbar" active>Home</NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="#/buttons">Buttons</NavLink>
      </NavItem>
    </Nav>
  </NavbarCollapse>
</Navbar>`}
      >
        <ThemeToggleSide />
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
        imports="Navbar, NavbarBrand, Nav, NavItem, NavLink"
        title="Sticky bar"
        summary="sticky keeps the bar at the top of its scroll container. false, the default, lets it scroll away."
        code={`<Navbar sticky variant="outline">
  <NavbarBrand href="#/navbar">Sticky</NavbarBrand>
  <Nav>
    <NavItem>
      <NavLink href="#/navbar">Home</NavLink>
    </NavItem>
    <NavItem>
      <NavLink href="#/buttons">Buttons</NavLink>
    </NavItem>
  </Nav>
</Navbar>`}
      >
        <div className="max-h-72 overflow-auto border-[3px] border-border">
          <Navbar sticky variant="outline">
            <NavbarBrand href="#/navbar">Sticky</NavbarBrand>
            <Nav>
              <NavItem>
                <NavLink href="#/navbar">Home</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#/buttons">Buttons</NavLink>
              </NavItem>
            </Nav>
          </Navbar>
          <div className="flex flex-col gap-4 p-4">
            {Array.from({ length: 8 }, (_, index) => (
              <p key={index} className="font-sans">
                Row {index + 1}. The bar stays at the top of this panel.
              </p>
            ))}
          </div>
        </div>
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
        summary="shadow false on the bar and on Dropdown removes both offsets. The menu keeps a normal border."
        code={`<Navbar shadow={false}>
  <NavbarBrand href="#/">Flat</NavbarBrand>
  <Dropdown shadow={false}>
    <DropdownToggle>More</DropdownToggle>
    <DropdownMenu>
      <DropdownItem href="#/buttons">Buttons</DropdownItem>
    </DropdownMenu>
  </Dropdown>
</Navbar>`}
      >
        <Navbar shadow={false}>
          <NavbarBrand href="#/">Flat</NavbarBrand>
          <Dropdown shadow={false}>
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
