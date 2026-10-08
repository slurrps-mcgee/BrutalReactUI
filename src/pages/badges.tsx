import { Badge, CodeSnippet, Container } from "../../lib/main";

export default function BadgesPage() {
  return (
    <Container title="Badges" fullWidth>
      <div className="flex flex-wrap items-center gap-3">
        <Badge>Primary</Badge>
        <Badge variant="secondary" size="md">
          Secondary
        </Badge>
        <Badge animate rounded>
          Animated
        </Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="danger">Danger</Badge>
        <Badge variant="info">Info</Badge>
      </div>
      <CodeSnippet
        language="tsx"
        code={`<Badge>Primary</Badge>
<Badge variant="secondary" size="md">Secondary</Badge>
<Badge animate rounded>Animated</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="danger">Danger</Badge>
<Badge variant="info">Info</Badge>`}
      />
    </Container>
  );
}
