import { Badge, Container } from "../../lib/main";
import { badgeNotes } from "./component-notes";
import { ComponentNotes, Example } from "./shared";

const variants = [
  "primary",
  "secondary",
  "success",
  "warning",
  "danger",
  "info",
] as const;

export default function BadgesPage() {
  return (
    <Container title="Badges" fullWidth>
      <p className="max-w-2xl font-sans">
        Badges mark a short status or count. The face is a span, so keep the
        text brief. A badge has no shadow wrapper.
      </p>

      <Example
        imports="Badge"
        title="Variants"
        summary="Primary is the default. Status colors cover success, warning, danger, and info."
        code={`<Badge>Primary</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="danger">Danger</Badge>
<Badge variant="info">Info</Badge>`}
      >
        <div className="flex flex-wrap items-center gap-3">
          {variants.map((variant) => (
            <Badge key={variant} variant={variant}>
              {variant}
            </Badge>
          ))}
        </div>
      </Example>

      <Example
        imports="Badge"
        title="Sizes"
        summary="Small is the default. Medium and large add padding."
        code={`<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>`}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Badge size="sm">Small</Badge>
          <Badge size="md">Medium</Badge>
          <Badge size="lg">Large</Badge>
        </div>
      </Example>

      <Example
        imports="Badge"
        title="Rounded and animation"
        summary="rounded uses the library radius. animate draws the border, then pops the face. There is still no shadow."
        code={`<Badge rounded>Rounded</Badge>
<Badge animate rounded>Animated</Badge>
<Badge border={false}>No border</Badge>`}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Badge rounded>Rounded</Badge>
          <Badge animate rounded>
            Animated
          </Badge>
          <Badge border={false}>No border</Badge>
          <Badge disabled>Disabled</Badge>
        </div>
      </Example>

      <ComponentNotes {...badgeNotes} />
    </Container>
  );
}
