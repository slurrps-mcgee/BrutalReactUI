import { useState } from "react";
import {
  Container,
  Form,
  FormFeedback,
  FormField,
  FormLabel,
  Select,
  SelectOption,
} from "../../lib/main";
import { selectNotes } from "./component-notes";
import { ComponentNotes, Example } from "./shared";

export default function SelectPage() {
  const [team, setTeam] = useState("engineering");

  return (
    <Container title="Select" fluid>
      <p className="max-w-2xl font-sans">
        Select is a listbox. The trigger shows the chosen label, and the
        placeholder until a value is chosen.
      </p>

      <Example
        imports="Select, SelectOption"
        title="Controlled"
        summary="value and onValueChange keep the choice. The closed trigger keeps the label."
        code={`<Select value={team} onValueChange={setTeam} required>
  <SelectOption value="design">Design</SelectOption>
  <SelectOption value="engineering">Engineering</SelectOption>
  <SelectOption value="support" disabled>Support</SelectOption>
</Select>`}
      >
        <FormField valid={Boolean(team)} className="max-w-sm">
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
      </Example>

      <Example
        imports="Select, SelectOption"
        title="Sizes and variants"
        summary="defaultValue sets the first choice. size and variant change the trigger."
        code={`<Select variant="secondary" size="lg" defaultValue="weekly">
  <SelectOption value="daily">Daily</SelectOption>
  <SelectOption value="weekly">Weekly</SelectOption>
</Select>
<Select variant="primary" size="sm" defaultValue="active">
  <SelectOption value="active">Active</SelectOption>
  <SelectOption value="paused">Paused</SelectOption>
</Select>`}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Select variant="secondary" size="lg" defaultValue="weekly">
            <SelectOption value="daily">Daily</SelectOption>
            <SelectOption value="weekly">Weekly</SelectOption>
            <SelectOption value="monthly">Monthly</SelectOption>
          </Select>
          <Select variant="primary" size="sm" defaultValue="active" rounded>
            <SelectOption value="active">Active</SelectOption>
            <SelectOption value="paused">Paused</SelectOption>
          </Select>
        </div>
      </Example>

      <Example
        imports="Select, SelectOption"
        title="Required and disabled"
        summary="A required select with no value fails native validation. disabled blocks the trigger."
        code={`<Select name="required-choice" required>
  <SelectOption value="one">Option one</SelectOption>
  <SelectOption value="two">Option two</SelectOption>
</Select>
<Select disabled placeholder="Disabled select">
  <SelectOption value="disabled">Disabled</SelectOption>
</Select>`}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Form onSubmit={(event) => event.preventDefault()}>
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
      </Example>

      <Example
        imports="Select, SelectOption"
        title="Flat and borderless"
        summary="shadow and border on Select pass to the trigger and the menu. border on an option puts a stroke on that row."
        code={`<Select shadow={false} defaultValue="one">
  <SelectOption value="one">Flat</SelectOption>
</Select>
<Select border={false} rounded defaultValue="one">
  <SelectOption value="one" border>Keeps a stroke</SelectOption>
  <SelectOption value="two">No stroke</SelectOption>
</Select>`}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Select shadow={false} defaultValue="one" aria-label="Flat select">
            <SelectOption value="one">Flat</SelectOption>
            <SelectOption value="two">Second</SelectOption>
          </Select>
          <Select
            border={false}
            rounded
            defaultValue="one"
            aria-label="Borderless select"
          >
            <SelectOption value="one" border>
              Keeps a stroke
            </SelectOption>
            <SelectOption value="two">No stroke</SelectOption>
          </Select>
        </div>
      </Example>

      <ComponentNotes {...selectNotes} />
    </Container>
  );
}
