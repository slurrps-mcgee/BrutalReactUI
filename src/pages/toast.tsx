import {
  Button,
  CodeSnippet,
  Container,
  ToastProvider,
  ToastViewport,
  useToast,
  type ToastPosition,
} from "../../lib/main";

const positions: ToastPosition[] = [
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
];

const toastCode = `<ToastProvider timer={8000}>
  <SaveButton />
  <ToastViewport position="bottom-right" />
</ToastProvider>

function SaveButton() {
  const { toast, dismiss } = useToast();

  return (
    <>
      <Button onClick={() => toast({
        title: "Saved",
        description: "Your changes are safe.",
        variant: "success",
      })}>
        Show toast
      </Button>
      <Button onClick={() => dismiss()}>Dismiss all</Button>
    </>
  );
}`;

function PositionDemo({ position }: { position: ToastPosition }) {
  const { toast, dismiss } = useToast();
  const label = position.replace("-", " ");

  return (
    <div className="flex min-w-0 flex-col gap-3 border-[3px] border-border bg-secondary-background p-4">
      <strong className="font-mono uppercase">{label}</strong>
      <div className="flex flex-wrap gap-3">
        <Button
          size="sm"
          onClick={() =>
            toast({
              variant: "success",
              title: "Saved",
              description: `Displayed at ${label}.`,
              rounded: position.endsWith("right"),
            })
          }
        >
          Show toast
        </Button>
        <Button size="sm" variant="outline" onClick={() => dismiss()}>
          Dismiss all
        </Button>
      </div>
      <ToastViewport position={position} />
    </div>
  );
}

export default function ToastPage() {
  return (
    <Container title="Toast" fullWidth animate="scroll" rounded>
      <p className="max-w-2xl font-sans">
        Each demo owns its notification queue. Open several, dismiss one with
        its close control, or clear a corner with Dismiss all.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {positions.map((position) => (
          <ToastProvider key={position} timer={8000}>
            <PositionDemo position={position} />
          </ToastProvider>
        ))}
      </div>

      <CodeSnippet code={toastCode} language="tsx" rounded />
    </Container>
  );
}
