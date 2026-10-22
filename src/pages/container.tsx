import { Container } from "../../lib/main";
import { containerNotes } from "./component-notes";
import { ComponentNotes, Example } from "./shared";

export default function ContainerPage() {
  return (
    <Container title="Container">
      <p className="max-w-2xl font-sans">
        A container frames a section. The normal width centers and stops at{" "}
        <span className="font-mono">max-w-7xl</span>.{" "}
        <span className="font-mono">fluid</span> fills the parent.{" "}
        <span className="font-mono">rounded</span> uses the library radius.{" "}
        <span className="font-mono">shadow</span> and{" "}
        <span className="font-mono">border</span> can be turned off.{" "}
        <span className="font-mono">animate</span> pops the face.
      </p>

      <Example
        imports="Container"
        title="Width"
        summary="Leave fluid off for the centered max-w-7xl frame. fluid fills whatever parent it sits in. This preview is already inside the page column, so the cap shows once that column is wider than 7xl."
        code={`<Container title="Normal">
  <p>Centered, max-w-7xl.</p>
</Container>
<Container title="Fluid" fluid>
  <p>Fills the parent.</p>
</Container>`}
      >
        <Container title="Normal">
          <p className="font-sans">Centered, max-w-7xl.</p>
        </Container>
        <Container title="Fluid" fluid>
          <p className="font-sans">Fills the parent.</p>
        </Container>
      </Example>

      <Example
        imports="Container"
        title="Rounded"
        summary="rounded applies the library radius to the shadow wrapper and the face."
        code={`<Container title="Square">
  <p>Square corners.</p>
</Container>
<Container title="Rounded" rounded>
  <p>Library radius.</p>
</Container>`}
      >
        <Container title="Square">
          <p className="font-sans">Square corners.</p>
        </Container>
        <Container title="Rounded" rounded>
          <p className="font-sans">Library radius.</p>
        </Container>
      </Example>

      <Example
        imports="Container"
        title="Shadow and border"
        summary="Both are on by default. shadow false drops the offset. border false drops the stroke."
        code={`<Container title="Both">
  <p>Shadow and border.</p>
</Container>
<Container title="Flat" shadow={false}>
  <p>No shadow.</p>
</Container>
<Container title="Open" border={false}>
  <p>No border.</p>
</Container>`}
      >
        <Container title="Both">
          <p className="font-sans">Shadow and border.</p>
        </Container>
        <Container title="Flat" shadow={false}>
          <p className="font-sans">No shadow.</p>
        </Container>
        <Container title="Open" border={false}>
          <p className="font-sans">No border.</p>
        </Container>
      </Example>

      <Example
        imports="Container"
        title="Animated"
        summary="animate pops the face. scroll waits until the section enters the viewport. The shadow stays on for that pop."
        code={`<Container title="Scroll" animate="scroll" rounded>
  <p>Draws when it enters.</p>
</Container>`}
      >
        <Container title="Scroll" animate="scroll" rounded>
          <p className="font-sans">Draws when it enters.</p>
        </Container>
      </Example>

      <ComponentNotes {...containerNotes} />
    </Container>
  );
}
