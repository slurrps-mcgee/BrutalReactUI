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
    <Container title="Form" fluid>
      <p className="max-w-2xl font-sans">
        Form groups fields and runs native validation on submit. FormField,
        FormLabel, and FormFeedback name each control and its message.
      </p>

      <Example
        imports="Form, FormField, FormLabel, Input, FormFeedback, Button"
        title="Validation"
        summary="rounded and animate on the form pass to the fields and the button. required fields block submit until they are filled."
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
        imports="Form, FormField, FormLabel, Input, Button"
        title="Static form"
        summary="Leave animate off for a form that is already in place. rounded on the field rounds that field only."
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
        imports="Form, FormField, FormLabel, Input"
        title="Flat and borderless"
        summary="shadow false flattens the frame and the fields. shadow on a field puts that offset back. border false clears the strokes, and border on a field restores one."
        code={`<Form shadow={false}>
  <FormField>
    <FormLabel>Flat</FormLabel>
    <Input placeholder="No offset" />
  </FormField>
  <FormField>
    <FormLabel>Keeps the offset</FormLabel>
    <Input placeholder="Own shadow" shadow />
  </FormField>
</Form>
<Form border={false}>
  <FormField>
    <FormLabel>No stroke</FormLabel>
    <Input placeholder="No frame" />
  </FormField>
  <FormField>
    <FormLabel>Keeps a stroke</FormLabel>
    <Input placeholder="Own border" border />
  </FormField>
</Form>`}
      >
        <Form shadow={false} wrapperClassName="max-w-md">
          <FormField>
            <FormLabel>Flat form</FormLabel>
            <Input placeholder="No offset" />
          </FormField>
          <FormField>
            <FormLabel>Keeps the offset</FormLabel>
            <Input placeholder="Own shadow" shadow />
          </FormField>
        </Form>
        <Form border={false} wrapperClassName="max-w-md">
          <FormField>
            <FormLabel>No stroke</FormLabel>
            <Input placeholder="No frame" />
          </FormField>
          <FormField>
            <FormLabel>Keeps a stroke</FormLabel>
            <Input placeholder="Own border" border />
          </FormField>
        </Form>
      </Example>

      <ComponentNotes {...formNotes} />
    </Container>
  );
}
