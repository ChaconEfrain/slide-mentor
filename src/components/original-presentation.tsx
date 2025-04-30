'use client';

import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { useState } from 'react';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export default function OriginalPresentation({fileUrl}: {fileUrl: string}) {

  const [pageNumber, setPageNumber] = useState(1);

  return (
    <section className=''>
      <Document file={fileUrl} className='shadow-md h-fit'>
        <Page pageNumber={pageNumber} width={600} />
      </Document>
    </section>
  )
}