import { useState, type MouseEvent } from "react";
import {
  CodeSnippet,
  Container,
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from "../../lib/main";

const code = `<Pagination label="Rounded results pages">
  <PaginationList>
    <PaginationItem><PaginationPrevious disabled rounded /></PaginationItem>
    <PaginationItem><PaginationLink active rounded>1</PaginationLink></PaginationItem>
    <PaginationItem><PaginationNext href="#page-2" rounded /></PaginationItem>
  </PaginationList>
</Pagination>`;

export default function PaginationPage() {
  const [page, setPage] = useState(1);
  const choose = (next: number) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setPage(next);
  };

  return (
    <Container title="Pagination" fullWidth animate="scroll" rounded>
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
      <CodeSnippet code={code} language="tsx" rounded />
    </Container>
  );
}
