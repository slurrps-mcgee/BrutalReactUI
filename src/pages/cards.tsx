import {
  Badge,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardImage,
  CodeSnippet,
  Container,
  Image,
} from "../../lib/main";
import exampleUrl from "../assets/example.png";

const code = `<Card variant="primary" animate="scroll" rounded>
  <CardImage>
    <Image image={image} title="Brutal React UI" />
  </CardImage>
  <CardHeader><Badge variant="info">Library</Badge></CardHeader>
  <CardBody>
    <h3>Brutal React UI</h3>
    <p>Thick borders, hard shadows, and configurable colors.</p>
  </CardBody>
</Card>`;

export default function CardsPage() {
  return (
    <Container title="Cards" fullWidth>
      <div className="grid gap-8 lg:grid-cols-3">
        <Card animate="scroll" rounded>
          <CardImage>
            <Image
              image={{ src: exampleUrl, width: 1200, height: 675 }}
              title="Brutal React UI"
              className="h-48 aspect-auto"
              animate
            />
          </CardImage>
          <CardHeader>
            <Badge variant="info">Library</Badge>
          </CardHeader>
          <CardBody>
            <h3 className="font-display text-2xl font-bold">Brutal React UI</h3>
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
              {["React", "Tailwind", "TypeScript"].map((item) => (
                <li key={item}>
                  <Badge variant="success">{item}</Badge>
                </li>
              ))}
            </ul>
          </CardFooter>
        </Card>
        <Card
          variant="secondary"
          size="sm"
          animate="scroll"
          rounded
        >
          <CardHeader>
            <Badge variant="warning">Secondary</Badge>
          </CardHeader>
          <CardBody>
            <h3 className="font-display text-xl font-bold">Compact card</h3>
            <p className="mt-2">
              A small secondary card demonstrates the alternate surface and
              compact spacing.
            </p>
          </CardBody>
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
            <Badge variant="info">Info</Badge>
          </CardHeader>
          <CardBody>
            <h3 className="font-display text-2xl font-bold">Field Notes</h3>
            <p className="mt-2">
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
                <Badge variant="success">Vite</Badge>
              </li>
            </ul>
          </CardFooter>
        </Card>
      </div>
      <CodeSnippet code={code} language="tsx" rounded />
    </Container>
  );
}
