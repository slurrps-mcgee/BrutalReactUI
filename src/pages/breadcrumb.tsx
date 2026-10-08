import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  CodeSnippet,
  Container,
} from "../../lib/main";

const code = `<Breadcrumb variant="primary">
  <BreadcrumbList>
    <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbPage>Components</BreadcrumbPage></BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`;

export default function BreadcrumbPageDemo() {
  return (
    <Container title="Breadcrumb" fullWidth animate="scroll" rounded>
      <div className="grid gap-6">
        {(["primary", "secondary", "outline"] as const).map((variant) => (
          <Breadcrumb
            key={variant}
            variant={variant}
            label={`${variant} breadcrumb`}
          >
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
                <BreadcrumbPage>{variant}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        ))}
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
      </div>
      <CodeSnippet code={code} language="tsx" rounded />
    </Container>
  );
}
