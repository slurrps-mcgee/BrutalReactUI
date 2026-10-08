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

const code = `<Form onSubmit={(event) => event.preventDefault()}>
  <FormField invalid={username.length > 0 && username.length < 3}>
    <FormLabel required>Username</FormLabel>
    <Input
      value={username}
      onChange={(event) => setUsername(event.target.value)}
      minLength={3}
      required
    />
    <FormFeedback>Use at least three characters.</FormFeedback>
  </FormField>
  <Button type="submit">Validate</Button>
</Form>`;

export default function ValidationPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [emailInvalid, setEmailInvalid] = useState(false);
  const invalid = username.length > 0 && username.length < 3;
  const valid = username.length >= 3;

  return (
    <Container title="Validation" fullWidth animate="scroll" rounded>
      <Form
        wrapperClassName="max-w-2xl"
        animate="scroll"
        rounded
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
      <CodeSnippet code={code} language="tsx" />
    </Container>
  );
}
