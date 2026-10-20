import {
  Button,
  Container,
  ToastProvider,
  ToastViewport,
  useToast,
  type ToastPosition,
} from "../../lib/main";
import { toastNotes } from "./component-notes";
import { ComponentNotes, Example } from "./shared";

const positions: ToastPosition[] = [
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
];

const variants = ["success", "warning", "danger", "info"] as const;

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

function FlatDemo() {
  const { toast } = useToast();

  return (
    <>
      <Button
        className="self-start"
        onClick={() =>
          toast({
            title: "Flat",
            description: "No offset.",
            shadow: false,
          })
        }
      >
        Show flat toast
      </Button>
      <ToastViewport position="bottom-left" />
    </>
  );
}

function VariantDemo() {
  const { toast } = useToast();

  return (
    <div className="flex flex-wrap gap-3">
      {variants.map((variant) => (
        <Button
          key={variant}
          size="sm"
          variant="outline"
          onClick={() =>
            toast({
              variant,
              title: variant,
              description: `A ${variant} toast.`,
            })
          }
        >
          {variant}
        </Button>
      ))}
      <ToastViewport position="bottom-right" />
    </div>
  );
}

export default function ToastPage() {
  return (
    <Container title="Toast" fullWidth animate="scroll" rounded>
      <p className="max-w-2xl font-sans">
        Toasts report an action that already happened. Each provider owns its
        own queue.
      </p>

      <Example
        imports="Button, ToastViewport, ToastProvider, useToast"
        title="Positions"
        summary="ToastViewport position chooses the corner. Dismiss one toast from its close control, or clear the corner with Dismiss all."
        code={`function Demo() {
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
      <ToastViewport position="bottom-right" />
    </>
  );
}

<ToastProvider timer={8000}>
  <Demo />
</ToastProvider>`}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {positions.map((position) => (
            <ToastProvider key={position} timer={8000}>
              <PositionDemo position={position} />
            </ToastProvider>
          ))}
        </div>
      </Example>

      <Example
        imports="useToast"
        title="Variants"
        summary="variant sets the toast color. The timer on the provider dismisses it."
        code={`const { toast } = useToast();

toast({
  variant: "warning",
  title: "Check",
  description: "Review this before you continue.",
});`}
      >
        <ToastProvider timer={8000}>
          <VariantDemo />
        </ToastProvider>
      </Example>

      <Example
        imports="useToast"
        title="Flat"
        summary="shadow false removes the offset from that toast."
        code={`const { toast } = useToast();

toast({ title: "Flat", description: "No offset.", shadow: false });`}
      >
        <ToastProvider>
          <FlatDemo />
        </ToastProvider>
      </Example>

      <ComponentNotes {...toastNotes} />
    </Container>
  );
}
