import { useState } from "react";
import {
  Button,
  CodeSnippet,
  Container,
  Form,
  FormFeedback,
  FormField,
  FormLabel,
  Input,
} from "../../lib/main";

const code = `<Form animate="scroll" rounded onSubmit={(event) => event.preventDefault()}>
  <FormField>
    <FormLabel required>Email</FormLabel>
    <Input name="email" type="email" required />
    <FormFeedback forceMount>Enter a valid email.</FormFeedback>
  </FormField>
  <Button type="submit">Submit</Button>
</Form>`;

export default function FormPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <Container title="Form" fullWidth>
      <Form
        wrapperClassName="max-w-2xl"
        animate="scroll"
        rounded
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
        }}
      >
        <FormField>
          <FormLabel required>Name</FormLabel>
          <Input name="name" required placeholder="Ada Lovelace" />
        </FormField>
        <FormField>
          <FormLabel required>Email</FormLabel>
          <Input
            name="email"
            type="email"
            required
            placeholder="ada@example.com"
          />
        </FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField valid>
            <FormLabel>Valid example</FormLabel>
            <Input defaultValue="Looks good" />
            <FormFeedback state="valid">Ready to submit.</FormFeedback>
          </FormField>
          <FormField invalid>
            <FormLabel>Invalid example</FormLabel>
            <Input defaultValue="Needs attention" />
            <FormFeedback>Review this value.</FormFeedback>
          </FormField>
        </div>
        <Button type="submit">Validate form</Button>
        {submitted && (
          <p role="status" className="font-mono text-sm font-bold text-success">
            Native validation passed.
          </p>
        )}
      </Form>
      <Form
        wrapperClassName="max-w-2xl"
        variant="secondary"
        size="sm"
        onSubmit={(event) => event.preventDefault()}
      >
        <FormField>
          <FormLabel>Static form</FormLabel>
          <Input placeholder="No entrance animation" rounded />
        </FormField>
        <Button type="submit" size="sm">
          Submit
        </Button>
      </Form>
      <CodeSnippet code={code} language="tsx" />
    </Container>
  );
}
