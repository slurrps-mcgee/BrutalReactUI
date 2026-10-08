import {
  createContext,
  useContext,
  useId,
  useState,
  type FormHTMLAttributes,
  type HTMLAttributes,
  type LabelHTMLAttributes,
  type ReactNode,
  type SubmitEvent,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import DrawBorder from "../utils/draw-border";
import {
  useAnimationTrigger,
  type AnimationTrigger,
} from "../utils/use-enter-viewport";

type FormContextValue = {
  submitted: boolean;
};

type FormFieldContextValue = {
  controlId: string;
  feedbackId: string;
  invalid: boolean;
  valid: boolean;
};

const FormContext = createContext<FormContextValue>({ submitted: false });
const FormFieldContext = createContext<FormFieldContextValue | null>(null);

// Used by controls that opt into FormField's generated accessibility state.
// eslint-disable-next-line react-refresh/only-export-components
export function useFormFieldControl() {
  return useContext(FormFieldContext);
}

// Form styles
const formStyles = cva(
  [
    // Layout and surface
    "relative z-10 isolate flex w-full flex-col border-[3px] font-mono",

    // Reduced motion
    "motion-reduce:transition-none",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "bg-main text-main-foreground [--surface:var(--main)] [--surface-foreground:var(--main-foreground)]",
        secondary:
          "bg-chart-2 text-main-foreground [--surface:var(--chart-2)] [--surface-foreground:var(--main-foreground)]",
        outline: "bg-[var(--surface)] text-[var(--surface-foreground)]",
      },
      size: {
        sm: "gap-3 p-4 text-sm",
        md: "gap-4 p-6 text-base",
        lg: "gap-6 p-8 text-lg",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "md",
    },
  },
);

// Form props
export type FormProps = Omit<
  FormHTMLAttributes<HTMLFormElement>,
  "noValidate"
> &
  VariantProps<typeof formStyles> & {
    animate?: AnimationTrigger;
    rounded?: boolean;
    shadow?: boolean;
    wrapperClassName?: string;
    faceClassName?: string;
  };

// Main Form component
export function Form({
  children,
  className,
  variant,
  size,
  animate = false,
  rounded = false,
  shadow = true,
  wrapperClassName: wrapperClassNameProp,
  faceClassName,
  onSubmit,
  ...props
}: FormProps) {
  const [submitted, setSubmitted] = useState(false);
  const { ref, shouldAnimate } = useAnimationTrigger<HTMLDivElement>(animate);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    setSubmitted(true);
    if (!event.currentTarget.checkValidity()) {
      event.preventDefault();
      event.currentTarget.reportValidity();
      return;
    }
    onSubmit?.(event);
  }

  const wrapperClassName = twMerge(
    [
      "relative isolate flex w-full",
      shadow && "shadow-[var(--shadow)]",
      rounded && "rounded-[var(--radius)]",
      shouldAnimate && "animate-brutal-pop",
    ]
      .filter(Boolean)
      .join(" "),
    wrapperClassNameProp,
  );

  return (
    <FormContext.Provider value={{ submitted }}>
      <div
        ref={ref}
        className={wrapperClassName}
        data-pop-direction="out"
      >
        <form
          noValidate
          className={twMerge(
            formStyles({ variant, size }),
            shouldAnimate ? "border-none brutal-pop-face" : "border-border",
            rounded && "rounded-[var(--radius)]",
            faceClassName,
            className,
          )}
          onSubmit={handleSubmit}
          {...props}
        >
          {shouldAnimate && (
            <DrawBorder
              animate
              radius={rounded ? "var(--radius)" : undefined}
              className="z-10"
            />
          )}
          {children}
        </form>
      </div>
    </FormContext.Provider>
  );
}

// FormField props
export type FormFieldProps = HTMLAttributes<HTMLDivElement> & {
  controlId?: string;
  valid?: boolean;
  invalid?: boolean;
  children?: ReactNode;
};

// Groups a label, control, and feedback message.
export function FormField({
  className,
  controlId: controlIdProp,
  valid = false,
  invalid = false,
  children,
  ...props
}: FormFieldProps) {
  const generatedId = useId();
  const { submitted } = useContext(FormContext);
  const controlId = controlIdProp ?? `${generatedId}-control`;
  const feedbackId = `${generatedId}-feedback`;
  const showInvalid = invalid;

  return (
    <FormFieldContext.Provider
      value={{ controlId, feedbackId, invalid: showInvalid, valid }}
    >
      <div
        className={twMerge("flex w-full flex-col gap-2", className)}
        data-valid={valid || undefined}
        data-invalid={showInvalid || undefined}
        data-form-submitted={submitted || undefined}
        {...props}
      >
        {children}
      </div>
    </FormFieldContext.Provider>
  );
}

// FormLabel props
export type FormLabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  required?: boolean;
};

// Field label
export function FormLabel({
  className,
  htmlFor,
  required = false,
  children,
  ...props
}: FormLabelProps) {
  const field = useContext(FormFieldContext);
  return (
    <label
      className={twMerge(
        "font-mono text-sm font-bold uppercase tracking-wide",
        className,
      )}
      htmlFor={htmlFor ?? field?.controlId}
      {...props}
    >
      {children}
      {required && (
        <span aria-hidden="true" className="ml-1 text-danger">
          *
        </span>
      )}
    </label>
  );
}

// FormFeedback props
export type FormFeedbackProps = HTMLAttributes<HTMLParagraphElement> & {
  state?: "valid" | "invalid";
  forceMount?: boolean;
};

// Validation feedback
export function FormFeedback({
  className,
  state = "invalid",
  forceMount = false,
  children,
  ...props
}: FormFeedbackProps) {
  const field = useContext(FormFieldContext);
  const visible =
    forceMount || (state === "invalid" ? field?.invalid : field?.valid);

  if (!visible) return null;

  return (
    <p
      id={field?.feedbackId}
      role={state === "invalid" ? "alert" : "status"}
      className={twMerge(
        "font-mono text-xs font-bold",
        state === "invalid" ? "text-danger" : "text-success",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export default Form;
