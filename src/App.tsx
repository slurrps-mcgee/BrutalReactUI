import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardImage,
  Container,
  Image,
  Input,
  Link,
  ThemeToggle,
  useTheme,
} from "../lib/main";
import exampleUrl from "./assets/example.png";

function Snippet({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto border-[3px] border-border bg-[var(--surface)] p-4 font-mono text-xs leading-relaxed">
      <code>{code.trim()}</code>
    </pre>
  );
}

function OutlineSet() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="outline">Outline</Button>
      <Badge variant="outline" size="lg">
        Outline
      </Badge>
      <div className="w-full max-w-48">
        <Input
          aria-label="Outline field"
          variant="outline"
          placeholder="Outline"
        />
      </div>
    </div>
  );
}

const outlineSetCode = `<Button variant="outline">Outline</Button>
<Badge variant="outline" size="lg">Outline</Badge>
<Input variant="outline" placeholder="Outline" />`;

function App() {
  const { theme } = useTheme();
  const [presses, setPresses] = useState(0);
  const [name, setName] = useState("Ada");

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8">
      <header className="flex flex-col gap-4 border-[3px] border-border bg-main p-5 text-main-foreground [--surface:var(--main)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-2">
            <p className="font-mono text-xs font-bold uppercase tracking-wide">
              Component library
            </p>
            <h1 className="font-display text-4xl font-bold sm:text-5xl">
              Brutal React UI
            </h1>
            <p className="max-w-xl font-sans text-base">
              Buttons, badges, fields, links, images, and cards on the shared
              palette. Active theme:{" "}
              <span className="font-mono font-bold">{theme}</span>.
            </p>
          </div>
          <ThemeToggle />
        </div>
        <Snippet
          code={`<header className="bg-main [--surface:var(--main)]">
  <ThemeToggle />
</header>`}
        />
      </header>

      <section id="surface" className="flex flex-col gap-6">
        <h2 className="font-display text-2xl font-bold">Surface</h2>
        <p className="max-w-2xl font-sans">
          Outline faces paint <span className="font-mono">--surface</span> from
          the nearest parent. The page falls back to the background color.
        </p>

        <div className="flex flex-col gap-4">
          <h3 className="font-display text-xl font-bold">Page</h3>
          <OutlineSet />
          <Snippet code={outlineSetCode} />
        </div>

        <Container id="surface-primary" title="Primary parent" fullWidth>
          <OutlineSet />
          <Snippet
            code={`<Container variant="primary">
  ${outlineSetCode.split("\n").join("\n  ")}
</Container>`}
          />
        </Container>

        <Container id="surface-secondary" title="Secondary parent" variant="secondary" fullWidth>
          <OutlineSet />
          <Snippet
            code={`<Container variant="secondary">
  ${outlineSetCode.split("\n").join("\n  ")}
</Container>`}
          />
        </Container>

        <div className="flex flex-col gap-4 border-[3px] border-border bg-main p-5 text-main-foreground [--surface:var(--main)]">
          <h3 className="font-display text-xl font-bold">Main parent</h3>
          <OutlineSet />
          <Snippet
            code={`<div className="bg-main [--surface:var(--main)]">
  ${outlineSetCode.split("\n").join("\n  ")}
</div>`}
          />
        </div>
      </section>

      <Container id="buttons" title="Buttons" fullWidth animate="scroll" rounded>
        <div className="flex flex-wrap items-center gap-4">
          <Button onClick={() => setPresses((count) => count + 1)}>
            Pressed {presses}
          </Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button size="sm">Small</Button>
          <Button size="lg" animate rounded>
            Large
          </Button>
          <Button disabled>Disabled</Button>
        </div>
        <Button fullWidth variant="secondary">
          Full width
        </Button>
        <Snippet
          code={`<Button>Pressed</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button size="sm">Small</Button>
<Button size="lg" animate rounded>Large</Button>
<Button disabled>Disabled</Button>
<Button fullWidth variant="secondary">Full width</Button>`}
        />
      </Container>

      <Container id="badges" title="Badges" fullWidth>
        <div className="flex flex-wrap items-center gap-3">
          <Badge>Primary</Badge>
          <Badge variant="secondary" size="md">
            Secondary
          </Badge>
          <Badge variant="outline" size="lg">
            Outline
          </Badge>
          <Badge animate rounded>
            Animated
          </Badge>
          <Badge className="bg-success text-success-foreground">Success</Badge>
          <Badge className="bg-warning text-warning-foreground">Warning</Badge>
          <Badge className="bg-danger text-danger-foreground">Danger</Badge>
          <Badge className="bg-info text-info-foreground">Info</Badge>
        </div>
        <Snippet
          code={`<Badge>Primary</Badge>
<Badge variant="secondary" size="md">Secondary</Badge>
<Badge variant="outline" size="lg">Outline</Badge>
<Badge animate rounded>Animated</Badge>
<Badge className="bg-success text-success-foreground">Success</Badge>
<Badge className="bg-warning text-warning-foreground">Warning</Badge>
<Badge className="bg-danger text-danger-foreground">Danger</Badge>
<Badge className="bg-info text-info-foreground">Info</Badge>`}
        />
      </Container>

      <Container id="inputs" title="Inputs" fullWidth>
        <label
          className="flex flex-col gap-2 font-mono text-sm font-bold"
          htmlFor="display-name"
        >
          Display name
          <Input
            id="display-name"
            name="display-name"
            value={name}
            placeholder="Your name"
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <p className="font-mono text-sm">
          Hello, <span className="font-bold">{name || "stranger"}</span>.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          <Input
            aria-label="Primary field"
            variant="primary"
            size="sm"
            placeholder="Small"
          />
          <Input
            aria-label="Secondary field"
            variant="secondary"
            placeholder="Secondary"
          />
          <Input
            aria-label="Outline field"
            variant="outline"
            size="lg"
            placeholder="Outline"
            rounded
          />
        </div>
        <Snippet
          code={`<Input value={name} placeholder="Your name" />
<Input variant="primary" size="sm" placeholder="Small" />
<Input variant="secondary" placeholder="Secondary" />
<Input variant="outline" size="lg" placeholder="Outline" rounded />`}
        />
      </Container>

      <Container id="links" title="Links" fullWidth>
        <div className="flex flex-wrap gap-6">
          <Link href="#buttons">Back to buttons</Link>
          <Link href="https://github.com" size="lg">
            GitHub
          </Link>
        </div>
        <Snippet
          code={`<Link href="#buttons">Back to buttons</Link>
<Link href="https://github.com" size="lg">GitHub</Link>`}
        />
      </Container>

      <Container id="images" title="Image" fullWidth rounded>
        <div className="max-w-xl">
          <Image
            image={{ src: exampleUrl, width: 1200, height: 675 }}
            title="Library preview"
            animate="scroll"
            rounded
          />
        </div>
        <Snippet
          code={`<Image
  image={{ src: exampleUrl, width: 1200, height: 675 }}
  title="Library preview"
  animate="scroll"
  rounded
/>`}
        />
      </Container>

      <Container id="cards" title="Cards" fullWidth>
        <div className="grid gap-8 lg:grid-cols-2">
          <Card animate="scroll" rounded>
            <CardImage>
              <Image
                image={{ src: exampleUrl, width: 1200, height: 675 }}
                title="Brutal React UI"
                className="h-48 aspect-auto"
              />
            </CardImage>
            <CardHeader>
              <Badge>Library</Badge>
            </CardHeader>
            <CardBody>
              <h3 className="font-display text-2xl font-bold">
                Brutal React UI
              </h3>
              <p className="mt-2">
                Thick borders, hard shadows, and a palette you can swap without
                rewriting components.
              </p>
            </CardBody>
            <CardFooter className="mt-auto flex flex-col gap-4">
              <ul
                className="flex flex-wrap gap-2"
                aria-label="Project technologies"
              >
                <li>
                  <Badge>React</Badge>
                </li>
                <li>
                  <Badge>Tailwind</Badge>
                </li>
                <li>
                  <Badge>TypeScript</Badge>
                </li>
              </ul>
            </CardFooter>
          </Card>
          <Card variant="outline">
            <CardImage>
              <Image
                image={{ src: exampleUrl, width: 512, height: 512 }}
                title="Field Notes"
                className="h-48 aspect-auto"
              />
            </CardImage>
            <CardHeader>
              <Badge variant="outline">Outline</Badge>
            </CardHeader>
            <CardBody>
              <h3 className="font-display text-2xl font-bold">Field Notes</h3>
              <p className="mt-2 text-foreground">
                The same card with the outline variant, a second image, and a
                shorter chip list.
              </p>
            </CardBody>
            <CardFooter className="mt-auto flex flex-col gap-4">
              <ul
                className="flex flex-wrap gap-2"
                aria-label="Project technologies"
              >
                <li>
                  <Badge variant="outline">Vite</Badge>
                </li>
              </ul>
            </CardFooter>
          </Card>
        </div>
        <Snippet
          code={`<Container title="Cards" fullWidth>
  <Card animate="scroll" rounded>
    <CardImage>
      <Image
        image={{ src: exampleUrl, width: 1200, height: 675 }}
        title="Brutal React UI"
        className="h-48 aspect-auto"
      />
    </CardImage>
    <CardHeader>
      <Badge>Library</Badge>
    </CardHeader>
    <CardBody>
      <h3>Brutal React UI</h3>
      <p>
        Thick borders, hard shadows, and a palette you can swap without
        rewriting components.
      </p>
    </CardBody>
    <CardFooter>
      <Badge>React</Badge>
      <Badge>Tailwind</Badge>
      <Badge>TypeScript</Badge>
    </CardFooter>
  </Card>
  <Card variant="outline">
    <CardImage>
      <Image
        image={{ src: exampleUrl, width: 512, height: 512 }}
        title="Field Notes"
        className="h-48 aspect-auto"
      />
    </CardImage>
    <CardHeader>
      <Badge variant="outline">Outline</Badge>
    </CardHeader>
    <CardBody>
      <h3>Field Notes</h3>
      <p>
        The same card with the outline variant, a second image, and a
        shorter chip list.
      </p>
    </CardBody>
    <CardFooter>
      <Badge variant="outline">Vite</Badge>
    </CardFooter>
  </Card>
</Container>`}
        />
      </Container>
    </div>
  );
}

export default App;
