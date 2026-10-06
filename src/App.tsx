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

function App() {
  const { theme } = useTheme();
  const [presses, setPresses] = useState(0);
  const [name, setName] = useState("Ada");

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8">
      <header className="flex flex-col gap-4 border-[3px] border-border bg-main p-5 text-main-txt sm:flex-row sm:items-end sm:justify-between">
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
      </header>

      <Container id="buttons" title="Buttons" fullWidth>
        <div className="flex flex-wrap items-center gap-4">
          <Button onClick={() => setPresses((count) => count + 1)}>
            Pressed {presses}
          </Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button size="sm">Small</Button>
          <Button size="lg" animate>
            Large
          </Button>
          <Button disabled>Disabled</Button>
        </div>
        <Button fullWidth variant="secondary">
          Full width
        </Button>
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
          <Badge animate>Animated</Badge>
        </div>
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
          />
        </div>
      </Container>

      <Container id="links" title="Links" fullWidth>
        <div className="flex flex-wrap gap-6">
          <Link href="#buttons">Back to buttons</Link>
          <Link href="https://github.com" size="lg">
            GitHub
          </Link>
        </div>
      </Container>

      <Container id="images" title="Image" fullWidth>
        <div className="max-w-xl">
          <Image
            image={{ src: exampleUrl, width: 1200, height: 675 }}
            title="Library preview"
            animate="scroll"
          />
        </div>
      </Container>

      <Container id="cards" title="Cards" fullWidth>
        <div className="grid gap-8 lg:grid-cols-2">
          <Card animate="scroll">
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
              <p className="mt-2 text-sub-txt">
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
              <p className="mt-2 text-sub-txt">
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
      </Container>
    </div>
  );
}

export default App;
