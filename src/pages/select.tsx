import { useState } from "react";
import {
  CodeSnippet,
  Container,
  Form,
  FormFeedback,
  FormField,
  FormLabel,
  Select,
  SelectOption,
} from "../../lib/main";

const code = `<Select value={value} onValueChange={setValue} required>
  <SelectOption value="design">Design</SelectOption>
  <SelectOption value="engineering">Engineering</SelectOption>
  <SelectOption value="support" disabled>Support</SelectOption>
</Select>`;

export default function SelectPage() {
  const [team, setTeam] = useState("engineering");

  return (
    <Container title="Select" fullWidth>
      <div className="grid gap-5 md:grid-cols-2">
        <FormField valid={Boolean(team)}>
          <FormLabel required>Team</FormLabel>
          <Select
            name="team"
            value={team}
            onValueChange={setTeam}
            required
            rounded
          >
            <SelectOption value="design">Design</SelectOption>
            <SelectOption value="engineering">Engineering</SelectOption>
            <SelectOption value="support" disabled>
              Support (unavailable)
            </SelectOption>
          </Select>
          <FormFeedback state="valid">Selected: {team}</FormFeedback>
        </FormField>
        <Select variant="secondary" size="lg" defaultValue="weekly">
          <SelectOption value="daily">Daily</SelectOption>
          <SelectOption value="weekly">Weekly</SelectOption>
          <SelectOption value="monthly">Monthly</SelectOption>
        </Select>
        <Select variant="primary" size="sm" defaultValue="active" rounded>
          <SelectOption value="active">Active</SelectOption>
          <SelectOption value="paused">Paused</SelectOption>
        </Select>
        <Form>
          <FormField>
            <FormLabel required>Required choice</FormLabel>
            <Select name="required-choice" required>
              <SelectOption value="one">Option one</SelectOption>
              <SelectOption value="two">Option two</SelectOption>
            </Select>
          </FormField>
          <button type="submit" className="font-mono font-bold underline">
            Check required selection
          </button>
        </Form>
        <Select disabled placeholder="Disabled select">
          <SelectOption value="disabled">Disabled</SelectOption>
        </Select>
      </div>
      <CodeSnippet code={code} language="tsx" />
    </Container>
  );
}
