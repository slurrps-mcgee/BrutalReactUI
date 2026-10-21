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
import { validationNotes } from "./component-notes";
import { ComponentNotes, Example } from "./shared";

export default function ValidationPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [emailInvalid, setEmailInvalid] = useState(false);
  const invalid = username.length > 0 && username.length < 3;
  const valid = username.length >= 3;

  return (
    <Container title="Validation" fluid animate="scroll" rounded>
      <p className="max-w-2xl font-sans">
        Validation paints a field while the person is typing, and again when the
        browser rejects the value on submit.
      </p>

      <Example
        imports="FormField, FormLabel, Input, FormFeedback"
        title="While typing"
        summary="Compare the value yourself and pass valid or invalid to the field. Each state has its own feedback."
        code={`<FormField invalid={username.length > 0 && username.length < 3} valid={username.length >= 3}>
  <FormLabel required>Username</FormLabel>
  <Input
    value={username}
    onChange={(event) => setUsername(event.target.value)}
    minLength={3}
    required
  />
  <FormFeedback>Use at least three characters.</FormFeedback>
  <FormFeedback state="valid">Username is ready.</FormFeedback>
</FormField>`}
      >
        <Form
          wrapperClassName="max-w-2xl"
          onSubmit={(event) => event.preventDefault()}
        >
          <FormField invalid={invalid} valid={valid}>
            <FormLabel required>Username</FormLabel>
            <Input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              minLength={3}
              required
              placeholder="brutalist"
            />
            <FormFeedback>Use at least three characters.</FormFeedback>
            <FormFeedback state="valid">Username is ready.</FormFeedback>
          </FormField>
        </Form>
      </Example>

      <Example
        imports="Input, FormFeedback"
        title="On submit"
        summary="onInvalid fires when the browser rejects the field. Clear the flag once the value becomes valid."
        code={`<Input
  type="email"
  required
  onInvalid={() => setEmailInvalid(true)}
  onChange={(event) => {
    setEmail(event.currentTarget.value);
    setEmailInvalid(!event.currentTarget.validity.valid);
  }}
/>
<FormFeedback>Enter a valid email address.</FormFeedback>`}
      >
        <Form
          wrapperClassName="max-w-2xl"
          animate="scroll"
          rounded
          onSubmit={(event) => event.preventDefault()}
        >
          <FormField invalid={emailInvalid}>
            <FormLabel required>Email</FormLabel>
            <Input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onInvalid={() => setEmailInvalid(true)}
              onChange={(event) => {
                setEmail(event.currentTarget.value);
                if (emailInvalid) {
                  setEmailInvalid(!event.currentTarget.validity.valid);
                }
              }}
            />
            <FormFeedback>Enter a valid email address.</FormFeedback>
          </FormField>
          <Button type="submit">Validate</Button>
        </Form>
      </Example>

      <ComponentNotes {...validationNotes} />
    </Container>
  );
}
