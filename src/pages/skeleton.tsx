import { Container, Skeleton } from "../../lib/main";
import { skeletonNotes } from "./component-notes";
import { ComponentNotes, Example } from "./shared";

export default function SkeletonPage() {
  return (
    <Container title="Skeleton" fullWidth animate="scroll" rounded>
      <p className="max-w-2xl font-sans">
        Skeletons stand in for content that has not loaded. label names the
        placeholder for assistive tech.
      </p>

      <Example
        title="Text and avatar"
        summary="circular is a disc. text is a short line. Set the size with className."
        code={`<Skeleton variant="circular" className="size-14" label="Loading avatar" />
<Skeleton variant="text" className="max-w-xs" label="Loading name" />`}
      >
        <div
          className="flex max-w-2xl items-center gap-4"
          aria-label="Loading profile"
        >
          <Skeleton
            variant="circular"
            className="size-14 shrink-0"
            label="Loading avatar"
          />
          <div className="grid flex-1 gap-3">
            <Skeleton
              variant="text"
              className="max-w-xs"
              label="Loading name"
            />
            <Skeleton
              variant="text"
              className="max-w-md"
              animation="wave"
              label="Loading biography"
            />
          </div>
        </div>
      </Example>

      <Example
        title="Blocks"
        summary="rectangular fills a region. wave moves a highlight across it. none holds still."
        code={`<Skeleton variant="rectangular" animation="wave" rounded className="min-h-40" />
<Skeleton variant="rectangular" animation="none" />`}
      >
        <div className="grid max-w-2xl gap-4">
          <Skeleton
            variant="rectangular"
            animation="wave"
            rounded
            className="min-h-40"
            label="Loading preview"
          />
          <Skeleton
            variant="rectangular"
            animation="none"
            label="Static placeholder"
          />
        </div>
      </Example>

      <ComponentNotes {...skeletonNotes} />
    </Container>
  );
}
