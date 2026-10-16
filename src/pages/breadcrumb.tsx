import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Container,
} from "../../lib/main";
import { breadcrumbNotes } from "./component-notes";
import { ComponentNotes, Example } from "./shared";

function Trail({
  variant,
  current,
}: {
  variant?: "primary" | "secondary" | "outline";
  current: string;
}) {
  return (
    <Breadcrumb variant={variant} label={`${current} breadcrumb`}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#home">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#components">Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{current}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default function BreadcrumbPageDemo() {
  return (
    <Container title="Breadcrumb" fullWidth animate="scroll" rounded>
      <p className="max-w-2xl font-sans">
        Breadcrumbs show the path to the current page. The last item is the
        current page and is not a link.
      </p>

      <Example
        title="Basic"
        summary="Wrap the list in Breadcrumb. Separate items with BreadcrumbSeparator."
        code={`<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="#home">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Current</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`}
      >
        <Trail current="Library" />
      </Example>

      <Example
        title="Variants"
        summary="Primary, secondary, and outline change the trail face."
        code={`<Breadcrumb variant="primary" />
<Breadcrumb variant="secondary" />
<Breadcrumb variant="outline" />`}
      >
        <div className="grid gap-6">
          <Trail variant="primary" current="Primary" />
          <Trail variant="secondary" current="Secondary" />
          <Trail variant="outline" current="Outline" />
        </div>
      </Example>

      <Example
        title="Custom separator and disabled"
        summary="Children of BreadcrumbSeparator replace the default mark. disabled removes a link."
        code={`<BreadcrumbSeparator>/</BreadcrumbSeparator>
<BreadcrumbLink disabled>Unavailable</BreadcrumbLink>`}
      >
        <Breadcrumb label="Disabled breadcrumb">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink disabled>Unavailable</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Current</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Example>

      <ComponentNotes {...breadcrumbNotes} />
    </Container>
  );
}
