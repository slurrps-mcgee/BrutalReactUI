import {
  Button,
  CodeSnippet,
  Container,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../lib/main";

const placements = ["top", "right", "bottom", "left"] as const;

const tooltipCode = `<Tooltip delay={150}>
  <TooltipTrigger asChild>
    <Button>Hover or focus</Button>
  </TooltipTrigger>
  <TooltipContent placement="top">
    Helpful context
  </TooltipContent>
</Tooltip>`;

export default function TooltipPage() {
  return (
    <Container title="Tooltip" fullWidth animate="scroll" rounded>
      <p className="max-w-2xl font-sans">
        Hover or focus each trigger to preview every placement. Press Escape to
        dismiss a visible tooltip without moving focus.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {placements.map((placement) => (
          <div
            key={placement}
            className="flex min-h-36 items-center justify-center border-[3px] border-border bg-secondary-background p-12"
          >
            <Tooltip delay={150}>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline">
                  {placement}
                </Button>
              </TooltipTrigger>
              <TooltipContent
                placement={placement}
                rounded={placement === "top" || placement === "bottom"}
              >
                {placement} tooltip
              </TooltipContent>
            </Tooltip>
          </div>
        ))}
      </div>

      <CodeSnippet code={tooltipCode} language="tsx" rounded />
    </Container>
  );
}
