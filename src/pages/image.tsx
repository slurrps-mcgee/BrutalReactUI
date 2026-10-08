import { CodeSnippet, Container, Image } from "../../lib/main";
import exampleUrl from "../assets/example.png";

export default function ImagePage() {
  return (
    <Container title="Image" fullWidth rounded>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="grid gap-2">
          <span className="font-mono text-sm font-bold uppercase">
            Animated
          </span>
          <Image
            image={{ src: exampleUrl, width: 1200, height: 675 }}
            title="Animated library preview"
            animate="scroll"
            rounded
          />
        </div>
        <div className="grid gap-2">
          <span className="font-mono text-sm font-bold uppercase">Static</span>
          <Image
            image={{ src: exampleUrl, width: 1200, height: 675 }}
            title="Static library preview"
          />
        </div>
      </div>
      <CodeSnippet
        language="tsx"
        code={`<Image
  image={{ src: exampleUrl, width: 1200, height: 675 }}
  title="Library preview"
  animate="scroll"
  rounded
/>`}
      />
    </Container>
  );
}
