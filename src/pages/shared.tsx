import type { ReactNode } from "react";
import { Button, CodeSnippet, Input } from "../../lib/main";
import type { ComponentNote } from "./component-notes";

export function Example({
  title,
  summary,
  code,
  children,
}: {
  title: string;
  summary: string;
  code: string;
  children: ReactNode;
}) {
  return (
    <section className="flex w-full flex-col gap-3">
      <div className="flex max-w-2xl flex-col gap-2">
        <h3 className="font-display text-2xl font-bold">{title}</h3>
        <p className="font-sans">{summary}</p>
      </div>
      <div className="flex flex-col gap-4 border-[3px] border-border bg-[var(--surface)] p-5">
        {children}
      </div>
      <CodeSnippet code={code} language="tsx" />
    </section>
  );
}

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

const passthrough =
  "className and the native element props still pass through.";

export function ComponentNotes({ summary, animates, props }: ComponentNote) {
  return (
    <section className="flex w-full flex-col gap-3">
      {/* Type */}
      <p className="max-w-2xl font-sans">{summary}</p>
      <p className="font-mono text-sm font-bold tracking-wide uppercase">
        Animation: {animates}
      </p>
      <p className="max-w-2xl font-sans text-sm">{passthrough}</p>
      {/* Border, surface */}
      <dl className="border-[3px] border-border bg-[var(--surface)]">
        {props.map((prop) => (
          <div
            key={prop.name}
            className="grid gap-1 border-b-[3px] border-border px-4 py-3 last:border-b-0 sm:grid-cols-[16rem_1fr] sm:gap-4"
          >
            <dt className="font-mono text-sm font-bold">
              {prop.name}
              <span className="mt-1 block font-normal">{prop.type}</span>
            </dt>
            <dd className="font-sans text-sm">{prop.detail}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
