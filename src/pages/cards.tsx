import {
  Badge,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardImage,
  Container,
  Image,
} from "../../lib/main";
import exampleUrl from "../assets/example.png";
import { cardNotes } from "./component-notes";
import { ComponentNotes, Example } from "./shared";

const preview = { src: exampleUrl, width: 1200, height: 675 };

export default function CardsPage() {
  return (
    <Container title="Cards" fullWidth>
      <p className="max-w-2xl font-sans">
        Cards group a title, a short description, and optional media. Header,
        body, image, and footer are separate parts.
      </p>

      <Example
        title="With media"
        summary="CardImage frames a picture. CardHeader, CardBody, and CardFooter stack under it."
        code={`<Card animate="scroll" rounded wrapperClassName="max-w-md">
  <CardImage>
    <Image image={image} title="Brutal React UI" />
  </CardImage>
  <CardHeader>
    <Badge variant="info">Library</Badge>
  </CardHeader>
  <CardBody>
    <h3>Brutal React UI</h3>
    <p>Thick borders, hard shadows, and configurable colors.</p>
  </CardBody>
  <CardFooter>
    <Badge variant="success">React</Badge>
  </CardFooter>
</Card>`}
      >
        <Card animate="scroll" rounded wrapperClassName="max-w-md">
          <CardImage>
            <Image
              image={preview}
              title="Brutal React UI"
              className="aspect-auto h-48"
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
          <CardFooter className="mt-auto flex flex-wrap gap-2">
            {["React", "Tailwind", "TypeScript"].map((item) => (
              <Badge key={item} variant="success">
                {item}
              </Badge>
            ))}
          </CardFooter>
        </Card>
      </Example>

      <Example
        title="Variants"
        summary="Primary is the default face. Secondary and outline are the other surfaces."
        code={`<Card variant="primary">Primary</Card>
<Card variant="secondary" size="sm">Secondary</Card>
<Card variant="outline">Outline</Card>`}
      >
        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <Badge>Primary</Badge>
            </CardHeader>
            <CardBody>
              <h3 className="font-display text-xl font-bold">Primary</h3>
              <p className="mt-2">The default card face.</p>
            </CardBody>
          </Card>
          <Card variant="secondary" size="sm">
            <CardHeader>
              <Badge variant="warning">Secondary</Badge>
            </CardHeader>
            <CardBody>
              <h3 className="font-display text-xl font-bold">Compact card</h3>
              <p className="mt-2">A small secondary surface.</p>
            </CardBody>
          </Card>
          <Card variant="outline" shadow={false}>
            <CardHeader>
              <Badge variant="info">Outline</Badge>
            </CardHeader>
            <CardBody>
              <h3 className="font-display text-xl font-bold">Outline</h3>
              <p className="mt-2">A flat outline card with the shadow off.</p>
            </CardBody>
          </Card>
        </div>
      </Example>

      <Example
        title="Rounded animation and no border"
        summary="animate with rounded draws the stroke on the card radius. border false removes that stroke."
        code={`<Card rounded animate>
  <CardBody>Rounded draw</CardBody>
</Card>
<Card border={false}>
  <CardBody>No stroke</CardBody>
</Card>`}
      >
        <div className="grid gap-6 md:grid-cols-2">
          <Card rounded animate>
            <CardBody>Rounded draw</CardBody>
          </Card>
          <Card border={false}>
            <CardBody>No stroke</CardBody>
          </Card>
        </div>
      </Example>

      <ComponentNotes {...cardNotes} />
    </Container>
  );
}
