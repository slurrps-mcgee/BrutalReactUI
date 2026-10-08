import { CodeSnippet, Container, Skeleton } from "../../lib/main";

const code = `<Skeleton variant="circular" className="size-14" />
<Skeleton variant="text" className="max-w-sm" />
<Skeleton variant="rectangular" animation="wave" rounded />`;

export default function SkeletonPage() {
  return (
    <Container title="Skeleton" fullWidth animate="scroll" rounded>
      <div className="grid max-w-2xl gap-6">
        <div className="flex items-center gap-4" aria-label="Loading profile">
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
      <CodeSnippet code={code} language="tsx" rounded />
    </Container>
  );
}
