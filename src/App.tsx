import { useEffect, useState, type MouseEvent } from "react";
import {
  Nav,
  NavGroup,
  NavItem,
  NavLink,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  Sidebar,
  ThemeToggle,
  Toggler,
} from "../lib/main";
import { PageView } from "./pages";

const links = [
  { id: "accordion", label: "Accordion" },
  { id: "alert", label: "Alert" },
  { id: "badges", label: "Badges" },
  { id: "breadcrumb", label: "Breadcrumb" },
  { id: "button-group", label: "Button Group" },
  { id: "buttons", label: "Buttons" },
  { id: "cards", label: "Cards" },
  { id: "carousel", label: "Carousel" },
  { id: "checkbox", label: "Checkbox" },
  { id: "code-snippet", label: "Code Snippet" },
  { id: "collapse", label: "Collapse" },
  { id: "dropdown", label: "Dropdown" },
  { id: "floating-label", label: "Floating Label" },
  { id: "form", label: "Form" },
  { id: "image", label: "Image" },
  { id: "input-group", label: "Input Group" },
  { id: "inputs", label: "Inputs" },
  { id: "links", label: "Links" },
  { id: "list-group", label: "List Group" },
  { id: "modal", label: "Modal" },
  { id: "navbar", label: "Navbar" },
  { id: "pagination", label: "Pagination" },
  { id: "progress", label: "Progress" },
  { id: "radio", label: "Radio" },
  { id: "range", label: "Range" },
  { id: "select", label: "Select" },
  { id: "sidebar", label: "Sidebar" },
  { id: "skeleton", label: "Skeleton" },
  { id: "spinner", label: "Spinner" },
  { id: "table", label: "Table" },
  { id: "toast", label: "Toast" },
  { id: "tooltip", label: "Tooltip" },
  { id: "validation", label: "Validation" },
] as const;

function pageId(hash: string) {
  const path = hash.replace(/^#\/?/, "");
  return path || "home";
}

function preventDemoNavigation(event: MouseEvent<HTMLElement>) {
  if ((event.target as Element).closest("a")) {
    event.preventDefault();
  }
}

function SiteLinks({ current }: { current: string }) {
  return (
    <Nav direction="column">
      <NavItem>
        <NavLink href="#/" active={current === "home"}>
          Home
        </NavLink>
      </NavItem>
      <NavGroup label="Library" defaultOpen>
        {links.map((link) => (
          <NavItem key={link.id}>
            <NavLink href={`#/${link.id}`} active={current === link.id}>
              {link.label}
            </NavLink>
          </NavItem>
        ))}
      </NavGroup>
    </Nav>
  );
}

function App() {
  const [hash, setHash] = useState(() => window.location.hash || "#/");
  const [open, setOpen] = useState(false);
  const current = pageId(hash);

  useEffect(() => {
    function onHashChange() {
      setHash(window.location.hash || "#/");
      setOpen(false);
    }

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return (
    <div className="min-h-screen md:grid md:grid-cols-[18rem_1fr]">
      <div className="hidden md:block md:sticky md:top-0 md:h-screen">
        <Sidebar>
          <div className="flex items-center justify-between gap-2">
            <a href="#/" className="font-display text-2xl font-bold">
              Brutal
            </a>
            <ThemeToggle />
          </div>
          <SiteLinks current={current} />
        </Sidebar>
      </div>

      <div className="flex min-w-0 flex-col">
        <div className="md:hidden">
          <Navbar variant="primary">
            <NavbarBrand href="#/">Brutal</NavbarBrand>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Toggler
                expanded={open}
                controls="site-nav"
                aria-label="Toggle navigation"
                iconAnimation="spin"
                onClick={() => setOpen((value) => !value)}
              />
            </div>
            <NavbarCollapse id="site-nav" open={open}>
              <SiteLinks current={current} />
            </NavbarCollapse>
          </Navbar>
        </div>
        <main
          className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8"
          onClickCapture={preventDemoNavigation}
        >
          <PageView id={current} />
        </main>
      </div>
    </div>
  );
}

export default App;
