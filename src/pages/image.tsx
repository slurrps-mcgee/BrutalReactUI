import { Container, Image } from "../../lib/main";
import exampleUrl from "../assets/example.png";
import { imageNotes } from "./component-notes";
import { ComponentNotes, Example } from "./shared";

const image = { src: exampleUrl, width: 1200, height: 675 };

export default function ImagePage() {
  return (
    <Container title="Image" fluid rounded>
      <p className="max-w-2xl font-sans">
        Image frames a picture with a caption. The caption is the accessible
        name, so title should describe the picture.
      </p>

      <Example
        imports="Image"
        title="Animated"
        summary="animate pops the frame. rounded uses the library radius."
        code={`<Image
  image={{ src, width: 1200, height: 675 }}
  title="Library preview"
  animate="scroll"
  rounded
/>`}
      >
        <Image
          image={image}
          title="Animated library preview"
          animate="scroll"
          rounded
          wrapperClassName="max-w-xl"
        />
      </Example>

      <Example
        imports="Image"
        title="Static"
        summary="Leave animate off for a frame that is already in place."
        code={`<Image
  image={{ src, width: 1200, height: 675 }}
  title="Static library preview"
/>`}
      >
        <Image
          image={image}
          title="Static library preview"
          wrapperClassName="max-w-xl"
        />
      </Example>

      <Example
        imports="Image"
        title="Sizes and shadow"
        summary="size changes the caption type. shadow false drops the offset."
        code={`<Image image={image} title="Small caption" size="sm" />
<Image image={image} title="Large caption" size="lg" shadow={false} />
<Image image={image} title="No stroke" border={false} />`}
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <Image image={image} title="Small caption" size="sm" />
          <Image image={image} title="Large caption" size="lg" shadow={false} />
          <Image image={image} title="No stroke" border={false} />
        </div>
      </Example>

      <ComponentNotes {...imageNotes} />
    </Container>
  );
}
