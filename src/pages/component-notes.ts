export type PropNote = {
  name: string;
  type: string;
  detail: string;
};

export type ComponentNote = {
  summary: string;
  animates: string;
  props: PropNote[];
};

type SharedShape = {
  shadow?: boolean;
  wrapper?: boolean;
  face?: boolean;
  fill?: boolean;
  size?: boolean;
};

const sharedShapes: [string, SharedShape][] = [
  ["Use Button", { shadow: true, wrapper: true, face: true, fill: true }],
  ["Group a title", { shadow: true, wrapper: true, face: true }],
  [
    "Frame a project image",
    { shadow: true, wrapper: true, face: true, size: true },
  ],
  ["Show a short status message", { shadow: true, size: true }],
  ["A brief message", { shadow: true, size: true }],
  ["Cycle through slides", { shadow: true }],
  ["Join related actions", { shadow: true }],
  ["Mark a short status", { face: true }],
  ["A text link", { wrapper: true, face: true, fill: true }],
  ["A single-line field", { shadow: true, wrapper: true, face: true }],
  ["A labeled checkbox", { wrapper: true, face: true }],
  ["One option in a radio", { wrapper: true, face: true }],
  ["A slider", { wrapper: true }],
  ["A vertical nav", { wrapper: true, face: true }],
];

function listed(props: PropNote[], name: string) {
  return props.some(
    (prop) =>
      prop.name === name ||
      prop.name.split(" / ").includes(name) ||
      prop.name.startsWith(`${name} `),
  );
}

function sharedProps(props: PropNote[], summary: string) {
  const shape =
    sharedShapes.find(([prefix]) => summary.startsWith(prefix))?.[1] ?? {};
  const extra: PropNote[] = [];
  if (shape.size && !listed(props, "size")) {
    extra.push({
      name: "size",
      type: "sm | md | lg",
      detail: "Padding and type size. md keeps the current look.",
    });
  }
  if (!listed(props, "rounded")) {
    extra.push({
      name: "rounded",
      type: "boolean",
      detail: "Uses the library radius.",
    });
  }
  if (shape.shadow && !listed(props, "shadow")) {
    extra.push({
      name: "shadow",
      type: "boolean",
      detail:
        "Draws the hard offset shadow. A truthy animate turns it on, because the pop moves by that offset.",
    });
  }
  if (!listed(props, "disabled")) {
    extra.push({
      name: "disabled",
      type: "boolean",
      detail: "Mutes the face and blocks a real control.",
    });
  }
  if (!listed(props, "className")) {
    extra.push({
      name: "className",
      type: "string",
      detail:
        "Classes on the face, or on the root when the component has no separate face.",
    });
  }
  if (shape.wrapper && !listed(props, "wrapperClassName")) {
    extra.push({
      name: "wrapperClassName",
      type: "string",
      detail: "Classes on the shadow wrapper.",
    });
  }
  if (shape.face && !listed(props, "faceClassName")) {
    extra.push({
      name: "faceClassName",
      type: "string",
      detail: "Classes on the bordered face.",
    });
  }
  if (shape.fill && !listed(props, "fillClassName")) {
    extra.push({
      name: "fillClassName",
      type: "string",
      detail: "Classes on the hover fill.",
    });
  }
  return extra;
}

function byPropName(a: PropNote, b: PropNote) {
  return a.name.localeCompare(b.name, "en", { sensitivity: "base" });
}

function note(
  summary: string,
  animates: string,
  props: PropNote[],
): ComponentNote {
  return {
    summary,
    animates,
    props: [...props, ...sharedProps(props, summary)].sort(byPropName),
  };
}

const mountOrScroll =
  'On mount with animate, or when it enters the viewport with animate="scroll".';

export const accordionNotes = note(
  "Stack labeled sections and keep one, or several, open. AccordionItem holds a trigger and a panel; the root decides whether a single panel or many can stay open.",
  "The panel height eases open and closed. shadow, border, rounded, and animate on Accordion pass to each item. Set the same prop on an item to replace the parent value.",
  [
    {
      name: "type",
      type: '"single" | "multiple"',
      detail: "One open panel, or several at once.",
    },
    {
      name: "value / defaultValue",
      type: "string | string[]",
      detail: "The open item id, or ids when type is multiple.",
    },
    {
      name: "onValueChange",
      type: "(value) => void",
      detail: "Fires with the next open id or ids.",
    },
    {
      name: "collapsible",
      type: "boolean",
      detail: "On a single accordion, lets the open panel close.",
    },
    {
      name: "flush",
      type: "boolean",
      detail: "Drops the outer frame so items sit edge to edge.",
    },
    {
      name: "disabled",
      type: "boolean",
      detail: "On the root or an item, blocks that trigger.",
    },
    { name: "rounded", type: "boolean", detail: "Uses the library radius." },
    {
      name: "border",
      type: "boolean",
      detail: "false removes the stroke on each item.",
    },
    {
      name: "faceClassName",
      type: "string",
      detail: "Classes on each item face.",
    },
    {
      name: "AccordionItem value",
      type: "string",
      detail: "Id used by value and onValueChange.",
    },
  ],
);

export const alertNotes = note(
  "Show a short status message with an optional title, icon, actions, and dismiss control. Pair it with a live region when the message appears after an action.",
  "None. Dismissing unmounts the alert without a draw or pop.",
  [
    {
      name: "variant",
      type: "primary | secondary | success | warning | danger | info",
      detail: "Sets the face color and the default icon.",
    },
    { name: "title", type: "ReactNode", detail: "Bold line above the body." },
    {
      name: "icon",
      type: "ReactNode | false",
      detail: "Replaces the default icon, or false to hide it.",
    },
    {
      name: "actions",
      type: "ReactNode",
      detail: "Buttons or links shown with the message.",
    },
    {
      name: "dismissible",
      type: "boolean",
      detail: "Adds a close control.",
    },
    {
      name: "open / defaultOpen",
      type: "boolean",
      detail: "Controlled or uncontrolled visibility.",
    },
    {
      name: "onOpenChange",
      type: "(open: boolean) => void",
      detail: "Fires when the alert opens or closes.",
    },
    {
      name: "onDismiss",
      type: "() => void",
      detail: "Fires when the close control is used.",
    },
    {
      name: "timer / duration",
      type: "number",
      detail: "Milliseconds before an automatic dismiss. 0 stays up.",
    },
    { name: "rounded", type: "boolean", detail: "Uses the library radius." },
    {
      name: "border",
      type: "boolean",
      detail: "false removes the stroke.",
    },
    {
      name: "shadow",
      type: "boolean",
      detail:
        "Draws the hard offset. The shadow and the face share this element.",
    },
    {
      name: "wrapperClassName",
      type: "string",
      detail: "Classes on the element that paints the shadow.",
    },
    {
      name: "faceClassName",
      type: "string",
      detail: "Classes on the face.",
    },
  ],
);

export const badgeNotes = note(
  "Mark a short status or count beside other content. The face is a span, so keep the text brief.",
  mountOrScroll,
  [
    {
      name: "variant",
      type: "primary | secondary | success | warning | danger | info",
      detail: "Sets the face color.",
    },
    { name: "size", type: "sm | md | lg", detail: "Padding and type size." },
    {
      name: "animate",
      type: 'boolean | "scroll"',
      detail: "Draws the border, then pops the face.",
    },
    { name: "rounded", type: "boolean", detail: "Uses the library radius." },
    {
      name: "border",
      type: "boolean",
      detail: "false removes the stroke. There is no shadow.",
    },
    {
      name: "faceClassName",
      type: "string",
      detail: "Classes on the face.",
    },
  ],
);

export const breadcrumbNotes = note(
  "Show the path back to a parent page. Breadcrumb is the nav, BreadcrumbItem wraps each step, and BreadcrumbLink is the anchor.",
  "None.",
  [
    {
      name: "variant",
      type: "primary | secondary | outline",
      detail: "Sets the link and separator color.",
    },
    { name: "size", type: "sm | md | lg", detail: "Type size of the trail." },
    {
      name: "label",
      type: "string",
      detail: 'Accessible name for the nav. Defaults to "Breadcrumb".',
    },
    {
      name: "BreadcrumbLink href",
      type: "string",
      detail: "Destination for that step.",
    },
    {
      name: "BreadcrumbLink active / disabled",
      type: "boolean",
      detail: "Marks the current step, or blocks the link.",
    },
    {
      name: "BreadcrumbLink border",
      type: "boolean",
      detail: "false removes the underline.",
    },
    {
      name: "BreadcrumbPage",
      type: "children",
      detail: "The current page. It sets aria-current.",
    },
  ],
);

export const buttonGroupNotes = note(
  "Join related actions into one row or column. selectionMode turns the group into a single-choice or multi-choice control.",
  "animate on the group draws the joined control. shadow, border, rounded, and animate pass to each item. Set the same prop on an item to replace the parent value.",
  [
    {
      name: "orientation",
      type: '"horizontal" | "vertical"',
      detail: "Lays the items in a row or a column.",
    },
    {
      name: "selectionMode",
      type: '"none" | "single" | "multiple"',
      detail: "Ignores selection, or tracks one or many values.",
    },
    {
      name: "value / defaultValue",
      type: "string | string[]",
      detail: "The selected item value or values.",
    },
    {
      name: "onValueChange",
      type: "(value) => void",
      detail: "Fires with the next selection.",
    },
    { name: "disabled", type: "boolean", detail: "Disables every item." },
    { name: "rounded", type: "boolean", detail: "Uses the library radius." },
    {
      name: "shadow",
      type: "boolean",
      detail: "Draws the hard offset on the group root.",
    },
    {
      name: "border",
      type: "boolean",
      detail: "false removes the stroke on each item.",
    },
    {
      name: "wrapperClassName",
      type: "string",
      detail: "Classes on the group root, which paints the shadow.",
    },
    {
      name: "faceClassName",
      type: "string",
      detail: "Classes on the group root.",
    },
    {
      name: "ButtonGroupItem value",
      type: "string",
      detail: "Value reported when that item is selected.",
    },
  ],
);

export const buttonNotes = note(
  "Use Button for actions. The shadow sits on a wrapper and the stroke sits on the face, so a pop never leaves the border behind the offset.",
  mountOrScroll,
  [
    {
      name: "variant",
      type: "primary | secondary | outline",
      detail: "Sets the face color.",
    },
    { name: "size", type: "sm | md | lg", detail: "Padding and type size." },
    { name: "fluid", type: "boolean", detail: "Stretches the wrapper." },
    {
      name: "animate",
      type: 'boolean | "scroll"',
      detail: "Draws the border, then pops the face.",
    },
    { name: "rounded", type: "boolean", detail: "Uses the library radius." },
    {
      name: "wrapperClassName",
      type: "string",
      detail: "Classes on the shadow wrapper.",
    },
    {
      name: "faceClassName",
      type: "string",
      detail: "Classes on the bordered face.",
    },
    {
      name: "fillClassName",
      type: "string",
      detail: "Classes on the hover fill.",
    },
  ],
);

export const cardNotes = note(
  "Group a title, body, and actions in a framed block. CardHeader, CardBody, and CardFooter are layout slots inside the face.",
  mountOrScroll,
  [
    {
      name: "variant",
      type: "primary | secondary | outline",
      detail: "Sets the face color.",
    },
    { name: "size", type: "sm | md | lg", detail: "Padding of the face." },
    {
      name: "animate",
      type: 'boolean | "scroll"',
      detail: "Draws the border, then pops the face.",
    },
    { name: "rounded", type: "boolean", detail: "Uses the library radius." },
    {
      name: "border",
      type: "boolean",
      detail:
        "false removes the stroke. shadow false also stops the hover press.",
    },
    {
      name: "wrapperClassName",
      type: "string",
      detail: "Classes on the shadow wrapper. Put width caps here.",
    },
    {
      name: "faceClassName",
      type: "string",
      detail: "Classes on the bordered face.",
    },
  ],
);

export const carouselNotes = note(
  "Cycle through slides with controls, indicators, autoplay, or a swipe. CarouselItem is one slide.",
  "The track slides between indexes. shadow, border, and rounded on Carousel pass to the controls. Set the same prop on a slide to replace the parent value.",
  [
    {
      name: "index / defaultIndex",
      type: "number",
      detail: "The visible slide.",
    },
    {
      name: "onIndexChange",
      type: "(index: number) => void",
      detail: "Fires when the slide changes.",
    },
    {
      name: "loop",
      type: "boolean",
      detail: "Wraps from the last slide to the first.",
    },
    {
      name: "controls",
      type: "boolean",
      detail: "Shows previous and next buttons.",
    },
    {
      name: "indicators",
      type: "boolean",
      detail: "Shows a button per slide.",
    },
    { name: "autoplay", type: "boolean", detail: "Advances on a timer." },
    {
      name: "autoplayInterval",
      type: "number",
      detail: "Milliseconds between autoplay steps.",
    },
    {
      name: "pauseOnHover / pauseOnFocus",
      type: "boolean",
      detail: "Pauses autoplay while the pointer or focus is inside.",
    },
    { name: "swipe", type: "boolean", detail: "Lets a drag change the slide." },
    { name: "rounded", type: "boolean", detail: "Uses the library radius." },
    {
      name: "border",
      type: "boolean",
      detail: "false removes the frame stroke.",
    },
    {
      name: "wrapperClassName",
      type: "string",
      detail: "Classes on the frame, which also paints the shadow.",
    },
    {
      name: "faceClassName",
      type: "string",
      detail: "Classes on the frame.",
    },
    {
      name: "label",
      type: "string",
      detail: "Accessible name for the region.",
    },
  ],
);

export const checkboxNotes = note(
  "A labeled checkbox. The visible box is a span; the input stays in the accessibility tree.",
  "None.",
  [
    { name: "label", type: "ReactNode", detail: "Text beside the box." },
    { name: "size", type: "sm | md | lg", detail: "Box and type size." },
    {
      name: "shadow",
      type: "boolean",
      detail:
        "false keeps a checked control from shifting or casting a shadow.",
    },
    { name: "rounded", type: "boolean", detail: "Uses the library radius." },
    {
      name: "wrapperClassName",
      type: "string",
      detail: "Classes on the label row.",
    },
    {
      name: "controlClassName",
      type: "string",
      detail: "Classes on the visible box.",
    },
  ],
);

export const codeSnippetNotes = note(
  "Show a copyable code sample. Pass the source as a string and a language so the highlighter can color it.",
  mountOrScroll,
  [
    { name: "code", type: "string", detail: "The source to display and copy." },
    {
      name: "language",
      type: "Language",
      detail: "Prism language id, such as tsx.",
    },
    {
      name: "variant",
      type: "primary | secondary | success | warning | danger | info",
      detail: "Sets the frame color.",
    },
    {
      name: "theme",
      type: "PrismTheme",
      detail: "Overrides the highlight colors.",
    },
    {
      name: "animate",
      type: 'boolean | "scroll"',
      detail: "Draws the border, then pops the frame.",
    },
    {
      name: "copyLabel / copiedLabel",
      type: "string",
      detail: "Copy button text.",
    },
    {
      name: "showLanguage",
      type: "boolean",
      detail: "Prints the language name.",
    },
    {
      name: "wrap",
      type: "boolean",
      detail: "Wraps long lines. Off keeps the horizontal scroller.",
    },
    { name: "rounded", type: "boolean", detail: "Uses the library radius." },
    {
      name: "shadow",
      type: "boolean",
      detail: "Draws the hard offset shadow.",
    },
    {
      name: "border",
      type: "boolean",
      detail: "false removes the stroke.",
    },
    {
      name: "wrapperClassName",
      type: "string",
      detail: "Classes on the shadow wrapper.",
    },
    {
      name: "faceClassName",
      type: "string",
      detail: "Classes on the frame.",
    },
  ],
);

export const collapseNotes = note(
  "Show and hide a region by height. Control it yourself, or leave it uncontrolled with defaultOpen.",
  "The panel height eases open and closed. shadow, border, rounded, and animate on Collapse pass to the trigger and the panel. Set the same prop on a part to replace the parent value.",
  [
    {
      name: "open / defaultOpen",
      type: "boolean",
      detail: "Controlled or uncontrolled visibility.",
    },
    { name: "disabled", type: "boolean", detail: "Ignores open changes." },
    { name: "rounded", type: "boolean", detail: "Uses the library radius." },
    {
      name: "border",
      type: "boolean",
      detail: "false removes the stroke.",
    },
    {
      name: "faceClassName",
      type: "string",
      detail: "Classes on the face.",
    },
    {
      name: "duration",
      type: "number",
      detail: "Milliseconds for the height change.",
    },
    {
      name: "onOpenChange",
      type: "(open: boolean) => void",
      detail: "Fires when the open state changes.",
    },
    {
      name: "onOpenStart / onOpenEnd",
      type: "() => void",
      detail: "Fires at the start and end of opening.",
    },
    {
      name: "onCloseStart / onCloseEnd",
      type: "() => void",
      detail: "Fires at the start and end of closing.",
    },
  ],
);

export const containerNotes = note(
  "Frame a section of a page. The normal width centers at max-w-7xl. fluid fills the parent.",
  "animate draws the border, then pops the face. shadow false and border false leave those parts off. A truthy animate turns the shadow on for the pop.",
  [
    {
      name: "title",
      type: "string",
      detail: "Section heading.",
    },
    {
      name: "variant",
      type: "primary | secondary | outline",
      detail: "Sets the face color.",
    },
    { name: "size", type: "sm | md | lg", detail: "Padding and type size." },
    {
      name: "fluid",
      type: "boolean",
      detail: "Fills the parent. false, the default, centers at max-w-7xl.",
    },
    {
      name: "rounded",
      type: "boolean",
      detail: "Rounds the wrapper and the face with the library radius.",
    },
    {
      name: "animate",
      type: 'false | true | "scroll"',
      detail:
        "Draws the border, then pops the face. scroll waits for the viewport.",
    },
    {
      name: "shadow",
      type: "boolean",
      detail: "Draws the hard offset. A truthy animate turns it on.",
    },
    {
      name: "border",
      type: "boolean",
      detail: "false removes the stroke, including the drawn one.",
    },
    {
      name: "direction",
      type: "row | column",
      detail: "Lays children across or down.",
    },
    {
      name: "align",
      type: "start | center | end | stretch",
      detail: "Cross-axis alignment.",
    },
    {
      name: "justify",
      type: "start | center | end | between",
      detail: "Main-axis alignment.",
    },
    {
      name: "gap",
      type: "none | sm | md | lg",
      detail: "Space between children.",
    },
    {
      name: "wrapperClassName",
      type: "string",
      detail: "Classes on the shadow wrapper.",
    },
    {
      name: "faceClassName",
      type: "string",
      detail: "Classes on the bordered face.",
    },
  ],
);

export const dropdownNotes = note(
  "A button that opens a menu of actions or links. DropdownToggle is the button, DropdownMenu is the panel, and DropdownItem is one row.",
  "shadow, border, rounded, and animate on Dropdown pass to the toggle and the menu. Set the same prop on the toggle or the menu to replace the parent value. Opening presses the toggle into its shadow. animate draws the toggle, then draws the menu and pops it out when it opens.",
  [
    {
      name: "DropdownToggle variant",
      type: "primary | secondary | outline",
      detail: "Sets the button face.",
    },
    {
      name: "DropdownToggle size",
      type: "sm | md | lg",
      detail: "Button size.",
    },
    {
      name: "DropdownMenu align",
      type: "left | right",
      detail:
        "Pins the menu to that edge of the toggle. right keeps a trailing toggle on the page.",
    },
    {
      name: "rounded",
      type: "boolean",
      detail: "Uses the library radius on the toggle and the menu.",
    },
    {
      name: "animate",
      type: 'false | true | "scroll"',
      detail:
        "Draws the toggle, then the menu when it opens. true plays on mount. scroll waits for the viewport. A child value replaces it.",
    },
    {
      name: "border",
      type: "boolean",
      detail: "false removes the toggle stroke and the menu stroke.",
    },
    {
      name: "DropdownItem href",
      type: "string",
      detail: "Renders the row as a link.",
    },
    {
      name: "DropdownItem active / disabled",
      type: "boolean",
      detail: "Marks or blocks that row.",
    },
    {
      name: "shadow",
      type: "boolean",
      detail: "Draws the hard offset on the toggle and the menu. false keeps both flat.",
    },
    {
      name: "fluid",
      type: "boolean",
      detail: "Stretches the toggle and the menu across the parent.",
    },
    {
      name: "wrapperClassName",
      type: "string",
      detail: "Classes on the dropdown root.",
    },
  ],
);

export const floatingLabelNotes = note(
  "Park a label over an input until the field has a value or focus, then move it to the top edge. The child must be a single input-like element.",
  "The label moves when the field is focused or filled. There is no draw or pop trigger.",
  [
    { name: "label", type: "ReactNode", detail: "The floating text." },
    {
      name: "htmlFor",
      type: "string",
      detail: "Id of the child control. Generated when omitted.",
    },
    {
      name: "labelClassName",
      type: "string",
      detail: "Classes on the floating label.",
    },
  ],
);

export const formNotes = note(
  "Wrap fields in a framed form. FormField groups a label, control, and FormFeedback, and shares valid or invalid state with the control.",
  "shadow, border, rounded, and animate on Form pass to the fields and buttons. Set the same prop on a control to replace the parent value. " +
    mountOrScroll,
  [
    {
      name: "variant",
      type: "primary | secondary | outline",
      detail: "Sets the frame color.",
    },
    { name: "size", type: "sm | md | lg", detail: "Padding of the frame." },
    {
      name: "animate",
      type: 'boolean | "scroll"',
      detail: "Draws the border, then pops the frame.",
    },
    { name: "rounded", type: "boolean", detail: "Uses the library radius." },
    {
      name: "shadow",
      type: "boolean",
      detail: "Draws the hard offset shadow.",
    },
    {
      name: "wrapperClassName",
      type: "string",
      detail: "Classes on the shadow wrapper.",
    },
    {
      name: "faceClassName",
      type: "string",
      detail: "Classes on the bordered face.",
    },
    {
      name: "FormField controlId",
      type: "string",
      detail: "Connects the label, control, and feedback.",
    },
    {
      name: "FormField valid / invalid",
      type: "boolean",
      detail: "Paints the field and feedback for that state.",
    },
  ],
);

export const imageNotes = note(
  "Frame a project image with a caption. The image fills the face and the title sits on top.",
  mountOrScroll,
  [
    {
      name: "image",
      type: "ProjectImage",
      detail: "Source, width, and height for the picture.",
    },
    { name: "title", type: "string", detail: "Caption and accessible name." },
    {
      name: "border",
      type: "boolean",
      detail: "false removes the stroke.",
    },
    {
      name: "animate",
      type: 'boolean | "scroll"',
      detail: "Draws the border, then pops the frame.",
    },
    { name: "rounded", type: "boolean", detail: "Uses the library radius." },
    {
      name: "wrapperClassName",
      type: "string",
      detail: "Classes on the shadow wrapper.",
    },
    {
      name: "faceClassName",
      type: "string",
      detail: "Classes on the bordered face.",
    },
  ],
);

export const inputGroupNotes = note(
  "Attach text or buttons to an input. InputGroupText is the static add-on. The input keeps its own props.",
  "shadow, border, rounded, and animate on InputGroup pass to the field, the text, and the button. The group keeps one shared offset. Set shadow or border on a child to replace the parent value.",
  [
    {
      name: "orientation",
      type: '"horizontal" | "vertical"',
      detail: "Places add-ons beside or above the field.",
    },
    { name: "label", type: "string", detail: "Accessible name for the group." },
    { name: "rounded", type: "boolean", detail: "Uses the library radius." },
    {
      name: "shadow",
      type: "boolean",
      detail: "false removes the plate and keeps the group from lifting.",
    },
    {
      name: "border",
      type: "boolean",
      detail: "false removes the strokes on the field and add-ons.",
    },
    {
      name: "faceClassName",
      type: "string",
      detail: "Classes on the joined face.",
    },
    {
      name: "wrapperClassName",
      type: "string",
      detail: "Classes on the outer group.",
    },
  ],
);

export const inputNotes = note(
  "A single-line field. valid and invalid paint the face; inside a FormField those flags come from the field when you omit them.",
  "None.",
  [
    {
      name: "variant",
      type: "primary | secondary | outline",
      detail: "Sets the face color.",
    },
    { name: "size", type: "sm | md | lg", detail: "Height and type size." },
    { name: "rounded", type: "boolean", detail: "Uses the library radius." },
    {
      name: "shadow",
      type: "boolean",
      detail:
        "false removes the plate and keeps the field from lifting on focus.",
    },
    {
      name: "valid / invalid",
      type: "boolean",
      detail: "Paints the validity state.",
    },
    {
      name: "wrapperClassName",
      type: "string",
      detail: "Classes on the outer wrapper.",
    },
    {
      name: "faceClassName",
      type: "string",
      detail: "Classes on the bordered face.",
    },
  ],
);

export const linkNotes = note(
  "A text link with a hover ink slide and an arrow. children is the visible label.",
  "None. The ink slides on hover and focus.",
  [
    { name: "href", type: "string", detail: "Destination." },
    { name: "children", type: "string", detail: "Visible label." },
    {
      name: "variant",
      type: "default | primary | secondary",
      detail: "Sets the ink and the hover color.",
    },
    { name: "size", type: "sm | md | lg", detail: "Type size." },
    {
      name: "wrapperClassName",
      type: "string",
      detail: "Classes on the shadow wrapper.",
    },
    {
      name: "faceClassName",
      type: "string",
      detail: "Classes on the bordered face.",
    },
    {
      name: "fillClassName",
      type: "string",
      detail: "Classes on the hover fill.",
    },
  ],
);

export const listGroupNotes = note(
  "A vertical list of rows. ListGroupItem is static text, ListGroupLink is an anchor, and ListGroupButton is a button.",
  "shadow, border, rounded, and animate on ListGroup pass to the rows. Set border or rounded on a row to replace the parent value. " +
    mountOrScroll,
  [
    {
      name: "variant",
      type: "primary | secondary | outline",
      detail: "Sets the face color.",
    },
    {
      name: "size",
      type: "sm | md | lg",
      detail: "Row padding and type size.",
    },
    {
      name: "animate",
      type: 'boolean | "scroll"',
      detail: "Draws the border, then pops the list.",
    },
    { name: "rounded", type: "boolean", detail: "Uses the library radius." },
    {
      name: "border",
      type: "boolean",
      detail: "false removes the outer stroke and the row rules.",
    },
    {
      name: "shadow",
      type: "boolean",
      detail: "Draws the hard offset shadow.",
    },
    {
      name: "active / disabled",
      type: "boolean",
      detail: "On a link or button row, marks or blocks that row.",
    },
    {
      name: "wrapperClassName",
      type: "string",
      detail: "Classes on the shadow wrapper.",
    },
    {
      name: "faceClassName",
      type: "string",
      detail: "Classes on the bordered list.",
    },
  ],
);

export const modalNotes = note(
  "A dialog over a backdrop. ModalClose renders a Button; omit children for the icon button, or pass a label such as Cancel.",
  "With animate, the dialog draws its border and pops into place, and the buttons inside use that same value. shadow, border, and rounded pass to the header, footer, and buttons. Set the same prop on a part to replace the parent value. It runs on open, not on scroll.",
  [
    {
      name: "open / defaultOpen",
      type: "boolean",
      detail: "Controlled or uncontrolled visibility.",
    },
    {
      name: "onOpenChange",
      type: "(open: boolean) => void",
      detail: "Fires when the dialog opens or closes.",
    },
    {
      name: "closeOnEscape / closeOnBackdrop",
      type: "boolean",
      detail: "Closes from the Escape key or a backdrop click.",
    },
    {
      name: "animate",
      type: "boolean",
      detail: "Runs the draw, pop, and reveal sequence.",
    },
    {
      name: "centered",
      type: "boolean",
      detail: "Centers the dialog in the viewport.",
    },
    {
      name: "scrollable",
      type: "boolean",
      detail: "Lets a long dialog scroll inside the viewport.",
    },
    {
      name: "variant",
      type: "primary | secondary | outline",
      detail: "Sets the face color.",
    },
    { name: "size", type: "sm | md | lg", detail: "Width of the dialog." },
    { name: "rounded", type: "boolean", detail: "Uses the library radius." },
    {
      name: "shadow",
      type: "boolean",
      detail: "Draws the hard offset shadow.",
    },
    {
      name: "wrapperClassName / faceClassName",
      type: "string",
      detail: "Classes on the shadow wrapper or the bordered face.",
    },
  ],
);

export const navbarNotes = note(
  "A horizontal bar with a brand, links, and a collapse for small screens. NavbarBrand is the home link, NavbarCollapse holds the links, and Toggler opens that collapse. Put ThemeToggle next to Toggler. Below the large breakpoint, the open menu stacks each link in a full-width row.",
  "shadow, border, rounded, and animate on the bar pass to the links, dropdowns, and toggler. Set the same prop on a child to replace the parent value. The collapse eases its height.",
  [
    {
      name: "variant",
      type: "primary | secondary | outline",
      detail: "Sets the bar color.",
    },
    { name: "size", type: "sm | md | lg", detail: "Bar height and type size." },
    {
      name: "animate",
      type: 'boolean | "scroll"',
      detail:
        "Draws the border, then pops the bar. Links, dropdown toggles, and the toggler use the same value unless they set their own. false on a child keeps that child still.",
    },
    { name: "rounded", type: "boolean", detail: "Uses the library radius." },
    {
      name: "shadow",
      type: "boolean",
      detail: "Draws the hard offset shadow.",
    },
    {
      name: "sticky",
      type: "boolean",
      detail: "Keeps the bar at the top of the nearest scroll container.",
    },
    { name: "disabled", type: "boolean", detail: "Blocks links in the bar." },
    {
      name: "NavbarCollapse open",
      type: "boolean",
      detail:
        "Shows the links below the large-screen breakpoint. Open, each item is a full-width row. fluid on a Dropdown in that row spans the toggle and the menu. From that breakpoint up, the items sit in a row.",
    },
    {
      name: "Toggler expanded",
      type: "boolean",
      detail: "Sets aria-expanded for the collapse.",
    },
    {
      name: "Toggler controls",
      type: "string",
      detail: "Id of the collapse this button opens.",
    },
    {
      name: "Toggler iconAnimation",
      type: "normal | arrow-left | arrow-right | arrow-up | arrow-down",
      detail: "Which icon motion the bars use.",
    },
    {
      name: "NavLink active",
      type: "boolean",
      detail:
        "Marks the current page. Compare href to the router location. Close the collapse when the path changes.",
    },
    {
      name: "NavItem / NavLink animate",
      type: 'false | true | "scroll"',
      detail:
        "Draws the link border, then pops it. animate on a Dropdown in that item draws the toggle and pops the menu when it opens. This replaces an animate value from the navbar. scroll waits for the viewport.",
    },
  ],
);

export const paginationNotes = note(
  "Page through a list. Pagination is the nav, PaginationItem wraps each control, and PaginationLink is the page button or anchor.",
  "None.",
  [
    {
      name: "variant",
      type: "primary | secondary | outline",
      detail: "Sets the control color.",
    },
    { name: "size", type: "sm | md | lg", detail: "Control size." },
    {
      name: "label",
      type: "string",
      detail: 'Accessible name for the nav. Defaults to "Pagination".',
    },
    {
      name: "PaginationLink active",
      type: "boolean",
      detail: "Marks the current page.",
    },
    {
      name: "PaginationLink disabled",
      type: "boolean",
      detail: "Blocks that control.",
    },
    {
      name: "PaginationLink rounded",
      type: "boolean",
      detail: "Uses the library radius on that control.",
    },
    {
      name: "PaginationLink shadow",
      type: "boolean",
      detail: "Draws the hard offset. On by default.",
    },
    {
      name: "PaginationLink border",
      type: "boolean",
      detail: "false removes the stroke.",
    },
  ],
);

export const progressNotes = note(
  "Show how far a task has gone. The indicator width is value divided by max.",
  "The bar can draw and pop with animate. The indicator width changes with the value.",
  [
    {
      name: "variant",
      type: "primary | secondary | success | warning | danger | info",
      detail: "Sets the indicator color.",
    },
    {
      name: "value",
      type: "number",
      detail: "Current amount. Omit it to show a moving segment.",
    },
    {
      name: "max",
      type: "number",
      detail: "Amount that fills the bar. Defaults to 100.",
    },
    {
      name: "label",
      type: "string",
      detail: "Accessible name. Defaults to Progress.",
    },
    { name: "showValue", type: "boolean", detail: "Prints the percent." },
    {
      name: "shadow",
      type: "boolean",
      detail: "Draws the hard offset shadow.",
    },
    {
      name: "border",
      type: "boolean",
      detail: "false removes the stroke.",
    },
    {
      name: "animate",
      type: 'boolean | "scroll"',
      detail: "Draws the border, then pops the bar.",
    },
    {
      name: "wrapperClassName / faceClassName / indicatorClassName",
      type: "string",
      detail: "Classes on the wrapper, face, or indicator.",
    },
  ],
);

export const radioNotes = note(
  "One option in a radio group. Give every radio in the group the same name.",
  "None.",
  [
    { name: "label", type: "ReactNode", detail: "Text beside the control." },
    { name: "size", type: "sm | md | lg", detail: "Control and type size." },
    {
      name: "shadow",
      type: "boolean",
      detail:
        "false keeps a checked control from shifting or casting a shadow.",
    },
    { name: "name", type: "string", detail: "Groups the options." },
    {
      name: "wrapperClassName",
      type: "string",
      detail: "Classes on the label row.",
    },
    {
      name: "controlClassName",
      type: "string",
      detail: "Classes on the visible control.",
    },
  ],
);

export const rangeNotes = note(
  "A slider for a numeric value. showValue prints the current number beside the label.",
  "None.",
  [
    { name: "label", type: "ReactNode", detail: "Text for the slider." },
    { name: "showValue", type: "boolean", detail: "Prints the current value." },
    {
      name: "output",
      type: "ReactNode",
      detail: "Replaces the printed value.",
    },
    { name: "rounded", type: "boolean", detail: "Uses the library radius." },
    {
      name: "wrapperClassName",
      type: "string",
      detail: "Classes on the outer stack.",
    },
  ],
);

export const selectNotes = note(
  "A custom listbox. SelectOption is one option. The trigger shows the chosen label, and the placeholder until a value is chosen.",
  "The menu opens under the trigger, then the trigger and the menu pop out together. shadow, border, rounded, and animate on Select pass to the trigger and the menu. Set the same prop on an option to replace the parent value.",
  [
    {
      name: "value / defaultValue",
      type: "string",
      detail: "The selected option value.",
    },
    {
      name: "onValueChange",
      type: "(value: string) => void",
      detail: "Fires when an option is chosen.",
    },
    {
      name: "open / defaultOpen",
      type: "boolean",
      detail: "Controlled or uncontrolled menu visibility.",
    },
    {
      name: "onOpenChange",
      type: "(open: boolean) => void",
      detail: "Fires when the menu opens or closes.",
    },
    { name: "name", type: "string", detail: "Submits the value with a form." },
    { name: "required", type: "boolean", detail: "Marks the field required." },
    { name: "disabled", type: "boolean", detail: "Blocks the trigger." },
    {
      name: "valid / invalid",
      type: "boolean",
      detail: "Paints the validity state.",
    },
    {
      name: "placeholder",
      type: "ReactNode",
      detail: "Shown before a value is chosen.",
    },
    {
      name: "variant",
      type: "primary | secondary | outline",
      detail: "Sets the trigger color.",
    },
    { name: "size", type: "sm | md | lg", detail: "Trigger size." },
    { name: "rounded", type: "boolean", detail: "Uses the library radius." },
    {
      name: "shadow",
      type: "boolean",
      detail: "false keeps the open menu flat. It does not pop.",
    },
    {
      name: "border",
      type: "boolean",
      detail: "false removes the trigger and menu strokes.",
    },
    {
      name: "wrapperClassName",
      type: "string",
      detail: "Classes on the select root.",
    },
    {
      name: "faceClassName",
      type: "string",
      detail: "Classes on the trigger.",
    },
    {
      name: "triggerClassName / menuClassName",
      type: "string",
      detail: "Classes on the trigger or the menu.",
    },
  ],
);

export const sidebarNotes = note(
  "A vertical nav that can collapse to icons or open as an offcanvas drawer. Nav, NavGroup, and NavLink build the links. Offcanvas is the drawer shell.",
  "shadow, border, rounded, and animate on the rail pass to the links. Set the same prop on a link to replace the parent value. A collapsed NavGroup opens a flyout; Offcanvas slides in from the side.",
  [
    {
      name: "collapsed",
      type: "boolean",
      detail: "Shrinks the rail to icons and opens groups in a flyout.",
    },
    {
      name: "offcanvas",
      type: "boolean",
      detail: "Renders the sidebar as a drawer.",
    },
    {
      name: "open / onClose",
      type: "boolean | () => void",
      detail: "On an offcanvas sidebar, controls the drawer.",
    },
    {
      name: "variant",
      type: "primary | secondary | outline",
      detail: "Sets the face color.",
    },
    { name: "size", type: "sm | md | lg", detail: "Padding inside the face." },
    {
      name: "animate",
      type: 'boolean | "scroll"',
      detail: "Draws the border, then pops the frame.",
    },
    { name: "rounded", type: "boolean", detail: "Uses the library radius." },
    {
      name: "shadow",
      type: "boolean",
      detail: "Draws the hard offset shadow.",
    },
    {
      name: "Nav direction",
      type: '"vertical" | "horizontal"',
      detail: "Stacks links or lays them in a row.",
    },
    {
      name: "NavLink href / active",
      type: "string | boolean",
      detail:
        "Destination, and whether this path is the current page. The app passes active.",
    },
    {
      name: "NavGroup label",
      type: "ReactNode",
      detail: "The button that opens the group.",
    },
    {
      name: "Offcanvas open / onClose",
      type: "boolean | () => void",
      detail: "Shows the drawer and closes it.",
    },
  ],
);

export const skeletonNotes = note(
  "Hold space while content loads. Set a width and height with className.",
  "pulse and wave loop inside the block. There is no draw or pop trigger.",
  [
    {
      name: "variant",
      type: "text | rectangular | circular",
      detail: "A line, a block, or a circle.",
    },
    {
      name: "animation",
      type: "pulse | wave | none",
      detail: "The loading motion. none leaves a static block.",
    },
    {
      name: "label",
      type: "string",
      detail: 'Accessible name. Defaults to "Loading".',
    },
    { name: "rounded", type: "boolean", detail: "Uses the library radius." },
  ],
);

export const spinnerNotes = note(
  "A small status mark for a wait. The visible glyph is decorative; the label is announced.",
  "The mark spins until it unmounts. There is no draw or pop trigger.",
  [
    {
      name: "variant",
      type: "primary | secondary | success | warning | danger | info | current",
      detail: "Sets the mark color.",
    },
    { name: "size", type: "sm | md | lg", detail: "Mark size." },
    {
      name: "label",
      type: "string",
      detail: 'Accessible name. Defaults to "Loading".',
    },
  ],
);

export const tableNotes = note(
  "Lay out rows and columns. TableResponsive frames the table and scrolls sideways when the columns are wider than the frame. Table is the table element.",
  "shadow, border, rounded, and animate on TableResponsive style the frame and pass to nested controls. bordered draws the cell grid. Set border, shadow, or rounded on a cell to replace that cell.",
  [
    {
      name: "Table variant",
      type: "primary | secondary | outline",
      detail: "Sets the cell color.",
    },
    { name: "Table size", type: "sm | md | lg", detail: "Cell padding." },
    {
      name: "bordered",
      type: "boolean",
      detail: "Draws a border on every cell.",
    },
    {
      name: "striped",
      type: "boolean",
      detail: "Tints every other body row with a darker mix.",
    },
    {
      name: "TableResponsive border",
      type: "boolean",
      detail: "false removes the frame stroke.",
    },
    {
      name: "hoverable",
      type: "boolean",
      detail: "Tints a body row on hover.",
    },
    { name: "compact", type: "boolean", detail: "Tightens the cell padding." },
    {
      name: "stickyHeader",
      type: "boolean",
      detail: "Pins the header while the body scrolls.",
    },
    {
      name: "TableResponsive rounded",
      type: "boolean",
      detail: "Uses the library radius on the frame.",
    },
    {
      name: "TableResponsive shadow",
      type: "boolean",
      detail: "Draws the hard offset shadow. On by default.",
    },
    {
      name: "TableResponsive animate",
      type: 'boolean | "scroll"',
      detail:
        "Draws the border, then pops the frame. Leave it off for a static table.",
    },
  ],
);

export const toastNotes = note(
  "A brief message, usually in a corner. ToastProvider places the stack. The toast can dismiss itself or wait for the close control.",
  "The toast fades and slides as it enters and leaves. There is no draw or pop trigger.",
  [
    {
      name: "variant",
      type: "primary | secondary | success | warning | danger | info",
      detail: "Sets the face color and the default icon.",
    },
    { name: "title", type: "ReactNode", detail: "Bold first line." },
    { name: "description", type: "ReactNode", detail: "Supporting line." },
    {
      name: "action",
      type: "ReactNode",
      detail: "A button or link in the toast.",
    },
    {
      name: "icon",
      type: "ReactNode | false",
      detail: "Replaces the default icon, or false to hide it.",
    },
    { name: "dismissible", type: "boolean", detail: "Shows a close control." },
    {
      name: "timer / duration",
      type: "number",
      detail: "Milliseconds before an automatic dismiss. 0 stays up.",
    },
    {
      name: "open / defaultOpen",
      type: "boolean",
      detail: "Controlled or uncontrolled visibility.",
    },
    {
      name: "onOpenChange / onDismiss",
      type: "(open?: boolean) => void",
      detail: "Fires when the toast closes.",
    },
    { name: "rounded", type: "boolean", detail: "Uses the library radius." },
  ],
);

export const tooltipNotes = note(
  "A short label for a control. Tooltip wraps the trigger, TooltipTrigger is the control, and TooltipContent is the floating text.",
  "The tip fades in after delay and fades out when the pointer or focus leaves. Escape dismisses it.",
  [
    {
      name: "delay",
      type: "number",
      detail: "Milliseconds before the tip opens. Defaults to 400.",
    },
    {
      name: "TooltipTrigger asChild",
      type: "boolean",
      detail: "Uses the child element as the trigger.",
    },
    {
      name: "TooltipContent placement",
      type: "top | right | bottom | left",
      detail: "Which side of the trigger the tip sits on.",
    },
    {
      name: "TooltipContent variant",
      type: "primary | secondary | outline",
      detail: "Sets the tip color.",
    },
    {
      name: "TooltipContent size",
      type: "sm | md | lg",
      detail: "Padding and type size.",
    },
    {
      name: "TooltipContent rounded",
      type: "boolean",
      detail: "Uses the library radius.",
    },
    {
      name: "TooltipContent shadow",
      type: "boolean",
      detail: "Draws the hard offset shadow.",
    },
  ],
);

export const validationNotes = note(
  "Show whether a field is valid or invalid. Put valid or invalid on FormField, or on the Input itself, and use FormFeedback for the message.",
  "None. The border color changes with the validity state.",
  [
    {
      name: "FormField valid / invalid",
      type: "boolean",
      detail: "Shares the state with the control and the feedback.",
    },
    {
      name: "Input valid / invalid",
      type: "boolean",
      detail: "Paints the field when it is outside a FormField.",
    },
    {
      name: "FormFeedback",
      type: "children",
      detail: "The message under the field. It follows the field state.",
    },
  ],
);
