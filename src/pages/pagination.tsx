import { useState, type MouseEvent } from "react";
import {
  Container,
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from "../../lib/main";
import { paginationNotes } from "./component-notes";
import { ComponentNotes, Example } from "./shared";

export default function PaginationPage() {
  const [page, setPage] = useState(1);
  const choose = (next: number) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setPage(next);
  };

  return (
    <Container title="Pagination" fullWidth animate="scroll" rounded>
      <p className="max-w-2xl font-sans">
        Pagination moves between pages of a list. Mark the current page with
        active and disable the previous or next control at the ends.
      </p>

      <Example
        title="Working pages"
        summary="Prevent the link navigation and store the page in state. The live text follows the current page."
        code={`<Pagination label="Demo pages">
  <PaginationList>
    <PaginationItem>
      <PaginationPrevious disabled={page === 1} />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink active={page === 1}>1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationNext disabled={page === 3} />
    </PaginationItem>
  </PaginationList>
</Pagination>`}
      >
        <p className="font-mono text-sm font-bold" aria-live="polite">
          Current page: {page}
        </p>
        <Pagination label="Demo pages" variant="outline">
          <PaginationList>
            <PaginationItem>
              <PaginationPrevious
                href={`#page-${page - 1}`}
                disabled={page === 1}
                onClick={choose(Math.max(1, page - 1))}
                rounded
              />
            </PaginationItem>
            {[1, 2, 3].map((number) => (
              <PaginationItem key={number}>
                <PaginationLink
                  href={`#page-${number}`}
                  active={page === number}
                  onClick={choose(number)}
                  rounded
                >
                  {number}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href={`#page-${page + 1}`}
                disabled={page === 3}
                onClick={choose(Math.min(3, page + 1))}
                rounded
              />
            </PaginationItem>
          </PaginationList>
        </Pagination>
      </Example>

      <Example
        title="Sizes and variants"
        summary="variant sets the face. size sm tightens the links."
        code={`<Pagination label="Square demo pages" variant="secondary" size="sm">
  <PaginationList>
    <PaginationItem>
      <PaginationPrevious disabled />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#square-1" active>1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#square-2" />
    </PaginationItem>
  </PaginationList>
</Pagination>`}
      >
        <Pagination label="Square demo pages" variant="secondary" size="sm">
          <PaginationList>
            <PaginationItem>
              <PaginationPrevious disabled />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#square-1" active>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#square-2">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#square-2" />
            </PaginationItem>
          </PaginationList>
        </Pagination>
      </Example>

      <Example
        title="Flat and borderless"
        summary="shadow is on by default. shadow false removes it. border false removes the stroke."
        code={`<PaginationLink href="#flat" shadow={false}>1</PaginationLink>
<PaginationLink href="#plain" border={false}>2</PaginationLink>`}
      >
        <Pagination label="Flat pages">
          <PaginationList>
            <PaginationItem>
              <PaginationLink href="#flat-1" shadow={false} active>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#flat-2" border={false}>
                2
              </PaginationLink>
            </PaginationItem>
          </PaginationList>
        </Pagination>
      </Example>

      <ComponentNotes {...paginationNotes} />
    </Container>
  );
}
