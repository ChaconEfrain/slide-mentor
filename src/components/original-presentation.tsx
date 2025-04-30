'use client';

import { type Dispatch, type SetStateAction, useMemo, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function OriginalPresentation({ fileUrl }: { fileUrl: string }) {
  const [numPages, setNumPages] = useState<null | number>(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <section className="flex flex-col gap-4">
      <Document
        file={fileUrl}
        className="shadow-md h-fit"
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page pageNumber={pageNumber} width={600} />
      </Document>
      {numPages && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                className={
                  pageNumber === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
            <RenderPaginationItems
              pageNumber={pageNumber}
              numPages={numPages}
              setPageNumber={setPageNumber}
            />
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setPageNumber((prev) => Math.min(prev + 1, numPages))
                }
                className={
                  pageNumber === numPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </section>
  );
}

interface PaginationProps {
  pageNumber: number;
  numPages: number;
  setPageNumber: Dispatch<SetStateAction<number>>;
}

function RenderPaginationItems({
  pageNumber,
  numPages,
  setPageNumber,
}: PaginationProps) {
  const items = useMemo(() => {
    if (numPages <= 5) {
      return [1, 2, 3, 4, 5];
    }

    if (pageNumber <= 3) {
      return [1, 2, 3];
    }

    if (pageNumber >= numPages - 2) {
      return [numPages - 2, numPages - 1, numPages];
    }

    return [pageNumber - 1, pageNumber, pageNumber + 1];
  }, [pageNumber, numPages]);

  return (
    <>
      {pageNumber > 3 && numPages > 5 && (
        <>
          <PaginationItem>
            <PaginationLink
              onClick={() => setPageNumber(1)}
              isActive={pageNumber === 1}
              className="cursor-pointer"
            >
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        </>
      )}

      {items.map((item) => (
        <PaginationItem key={item}>
          <PaginationLink
            onClick={() => setPageNumber(item)}
            isActive={pageNumber === item}
            className="cursor-pointer"
          >
            {item}
          </PaginationLink>
        </PaginationItem>
      ))}

      {pageNumber < numPages - 2 && numPages > 5 && (
        <>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              onClick={() => setPageNumber(numPages)}
              isActive={pageNumber === numPages}
              className="cursor-pointer"
            >
              {numPages}
            </PaginationLink>
          </PaginationItem>
        </>
      )}
    </>
  );
}