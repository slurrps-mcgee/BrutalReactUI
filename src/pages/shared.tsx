import { Button, Input } from "../../lib/main";

export function OutlineSet() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="outline">Outline</Button>
      <div className="w-full max-w-48">
        <Input
          aria-label="Outline field"
          variant="outline"
          placeholder="Outline"
        />
      </div>
    </div>
  );
}

export const outlineSetCode = `<Button variant="outline">Outline</Button>
<Input variant="outline" placeholder="Outline" />`;
