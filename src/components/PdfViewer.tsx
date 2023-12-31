import { useResizeObserver } from '@wojtekmaj/react-hooks';
// import './Sample.css';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { useCallback, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// import pdfjs from 'pdfjs-dist/webpack';
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const options = {
  cMapUrl: '/cmaps/',
  standardFontDataUrl: '/standard_fonts/',
};

const resizeObserverOptions = {};

const maxWidth = 800;

type PDFFile = string | File | null;
interface pdfFileProps {
  pdfFile: File | string | null;
}

// Take Button and bring out to NewPdf

export default function PdfViewer({ pdfFile }: pdfFileProps) {
  // const [file, setFile] = useState<PDFFile>(null);
  const [numPages, setNumPages] = useState<number>();
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>();

  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const [entry] = entries;

    if (entry) {
      setContainerWidth(entry.contentRect.width);
    }
  }, []);

  useResizeObserver(containerRef, resizeObserverOptions, onResize);

  // function onFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
  //   const { files } = event.target;
  //   console.log(files);

  //   if (files && files[0]) {
  //     setFile(files[0] || null);
  //   }
  // }

  function onDocumentLoadSuccess({
    numPages: nextNumPages,
  }: PDFDocumentProxy): void {
    setNumPages(nextNumPages);
  }

  return (
    <div className='Example'>
      <div className='Example__container__document' ref={setContainerRef}>
        <Document
          file={pdfFile}
          onLoadSuccess={onDocumentLoadSuccess}
          options={options}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              width={
                containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth
              }
            />
          ))}
        </Document>
      </div>
    </div>
  );
}
