import { useState } from "react";
import {
  Button,
  Container,
  Form,
  FormFeedback,
  FormField,
  FormLabel,
  Input,
} from "../../lib/main";
import { formNotes } from "./component-notes";
import { ComponentNotes, Example } from "./shared";

export default function FormPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <Container title="Form" fullWidth>
      <p className="max-w-2xl font-sans">
        Form groups fields and runs native validation on submit. FormField,
        FormLabel, and FormFeedback name each control and its message.
      </p>

      <Example
        title="Validation"
        summary="required fields block submit until they are filled. valid and invalid paint a field on purpose."
        code={`<Form onSubmit={(event) => event.preventDefault()}>
  <FormField>
    <FormLabel required>Email</FormLabel>
    <Input name="email" type="email" required />
  </FormField>
  <FormField valid>
    <FormLabel>Valid example</FormLabel>
    <Input defaultValue="Looks good" />
    <FormFeedback state="valid">Ready to submit.</FormFeedback>
  </FormField>
  <Button type="submit">Submit</Button>
</Form>`}
      >
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
            <p
              role="status"
              className="font-mono text-sm font-bold text-success"
            >
              Native validation passed.
            </p>
          )}
        </Form>
      </Example>

      <Example
        title="Static form"
        summary="Leave animate off for a form that is already in place. variant and size change the frame."
        code={`<Form variant="secondary" size="sm">
  <FormField>
    <FormLabel>Static form</FormLabel>
    <Input placeholder="No entrance animation" />
  </FormField>
  <Button type="submit" size="sm">Submit</Button>
</Form>`}
      >
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
      </Example>

      <Example
        title="Flat and borderless"
        summary="shadow false removes the offset. border false removes the frame stroke."
        code={`<Form shadow={false}>
  <FormField>
    <FormLabel>Flat</FormLabel>
    <Input placeholder="No offset" />
  </FormField>
</Form>
<Form border={false}>
  <FormField>
    <FormLabel>No stroke</FormLabel>
    <Input placeholder="No frame" />
  </FormField>
</Form>`}
      >
        <Form shadow={false} wrapperClassName="max-w-md">
          <FormField>
            <FormLabel>Flat form</FormLabel>
            <Input placeholder="No offset" />
          </FormField>
        </Form>
        <Form border={false} wrapperClassName="max-w-md">
          <FormField>
            <FormLabel>No stroke</FormLabel>
            <Input placeholder="No frame" />
          </FormField>
        </Form>
      </Example>

      <ComponentNotes {...formNotes} />
    </Container>
  );
}
