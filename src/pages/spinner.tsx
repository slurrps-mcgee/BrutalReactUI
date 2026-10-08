import { Button, CodeSnippet, Container, Spinner } from "../../lib/main";

const code = `<Spinner variant="primary" size="sm" label="Loading results" />
<Spinner variant="success" size="md" />
<Spinner variant="danger" size="lg" />`;

export default function SpinnerPage() {
  return (
    <Container title="Spinner" fullWidth animate="scroll" rounded>
      <div className="flex flex-wrap items-center gap-8">
        <Spinner variant="primary" size="sm" label="Loading small item" />
        <Spinner variant="secondary" label="Loading secondary item" />
        <Spinner variant="success" size="lg" label="Loading large item" />
        <Spinner variant="warning" size="lg" label="Waiting for response" />
        <Spinner variant="danger" size="lg" label="Retrying request" />
        <Spinner variant="info" size="lg" label="Fetching information" />
      </div>
      <Button disabled>
        <Spinner variant="current" size="sm" label="Submitting form" />
        Submitting
      </Button>
      <CodeSnippet code={code} language="tsx" rounded />
    </Container>
  );
}
