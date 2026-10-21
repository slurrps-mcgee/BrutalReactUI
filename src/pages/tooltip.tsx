import {
  Button,
  Container,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../lib/main";
import { tooltipNotes } from "./component-notes";
import { ComponentNotes, Example } from "./shared";

const placements = ["top", "right", "bottom", "left"] as const;

export default function TooltipPage() {
  return (
    <Container title="Tooltip" fluid animate="scroll" rounded>
      <p className="max-w-2xl font-sans">
        Tooltips name or explain a control. Hover or focus the trigger. Escape
        dismisses a visible tooltip without moving focus.
      </p>

      <Example
        imports="Tooltip, TooltipTrigger, Button, TooltipContent"
        title="Placements"
        summary="placement puts the tip above, beside, or below the trigger."
        code={`<Tooltip delay={150}>
  <TooltipTrigger asChild>
    <Button>Hover or focus</Button>
  </TooltipTrigger>
  <TooltipContent placement="top">Helpful context</TooltipContent>
</Tooltip>`}
      >
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
      </Example>

      <Example
        imports="Tooltip, TooltipTrigger, Button, TooltipContent"
        title="Delay"
        summary="delay waits a number of milliseconds before the tip opens."
        code={`<Tooltip delay={600}>
  <TooltipTrigger asChild>
    <Button variant="secondary">Slower tip</Button>
  </TooltipTrigger>
  <TooltipContent>Opens after a short wait.</TooltipContent>
</Tooltip>`}
      >
        <Tooltip delay={600}>
          <TooltipTrigger asChild>
            <Button variant="secondary" className="self-start">
              Slower tip
            </Button>
          </TooltipTrigger>
          <TooltipContent>Opens after a short wait.</TooltipContent>
        </Tooltip>
      </Example>

      <Example
        imports="Tooltip, TooltipTrigger, Button, TooltipContent"
        title="Flat"
        summary="shadow false removes the offset. The trigger highlight keeps a full stroke."
        code={`<Tooltip>
  <TooltipTrigger asChild>
    <Button>Flat tip</Button>
  </TooltipTrigger>
  <TooltipContent shadow={false}>No offset.</TooltipContent>
</Tooltip>`}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button className="self-start">Flat tip</Button>
          </TooltipTrigger>
          <TooltipContent shadow={false}>No offset.</TooltipContent>
        </Tooltip>
      </Example>

      <ComponentNotes {...tooltipNotes} />
    </Container>
  );
}
