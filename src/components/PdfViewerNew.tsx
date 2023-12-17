import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function PDFViewer(props: any) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1); // start on first page
  const [loading, setLoading] = useState(true);
  const [pageWidth, setPageWidth] = useState(0);

  function onDocumentLoadSuccess({
    numPages: nextNumPages,
  }: {
    numPages: number;
  }) {
    setNumPages(nextNumPages);
  }

  function onPageLoadSuccess() {
    setPageWidth(window.innerWidth);
    setLoading(false);
  }

  const options = {
    cMapUrl: 'cmaps/',
    cMapPacked: true,
    standardFontDataUrl: 'standard_fonts/',
  };

  // Go to next page
  function goToNextPage() {
    setPageNumber((prevPageNumber) => prevPageNumber + 1);
  }

  function goToPreviousPage() {
    setPageNumber((prevPageNumber) => prevPageNumber - 1);
  }

  /* 
    Changes to Make
    add pdf pass in to component to make sure it even works 
    Pass the state of the pdf file to the component from the parent component
    Change styling to not be full page
    Change styling of page counter to match current styling style
    switch tailwindcss styling to px
  */

  return (
    <>
      <Nav pageNumber={pageNumber} numPages={numPages} />
      <div
        hidden={loading}
        style={{ height: 'calc(100vh - 116px)' }}
        className='flex items-center'
      >
        <div className='absolute z-10 flex w-full items-center justify-between px-2'>
          <button
            onClick={goToPreviousPage}
            disabled={pageNumber <= 1}
            className='h-[calc(100vh - 64px)] relative px-2 py-24 text-gray-400 hover:text-gray-50 focus:z-20'
          >
            <span className='sr-only'>Previous</span>
            <ChevronLeftIcon className='h-10 w-10' aria-hidden='true' />
          </button>
          <button
            onClick={goToNextPage}
            disabled={pageNumber >= numPages!}
            className='h-[calc(100vh - 64px)] relative px-2 py-24 text-gray-400 hover:text-gray-50 focus:z-20'
          >
            <span className='sr-only'>Next</span>
            <ChevronRightIcon className='h-10 w-10' aria-hidden='true' />
          </button>
        </div>

        <div className='mx-auto flex h-full justify-center'>
          <Document
            file='./public/pdfs/dummy.pdf'
            onLoadSuccess={onDocumentLoadSuccess}
            options={options}
            renderMode='canvas'
            className=''
          >
            <Page
              className=''
              key={pageNumber}
              pageNumber={pageNumber}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              onLoadSuccess={onPageLoadSuccess}
              onRenderError={() => setLoading(false)}
              width={Math.max(pageWidth * 0.8, 390)}
            />
          </Document>
        </div>
      </div>
    </>
  );
}

function Nav({
  pageNumber,
  numPages,
}: {
  pageNumber: number;
  numPages: number;
}) {
  return (
    <nav className='bg-black'>
      <div className='mx-auto px-2 sm:px-6 lg:px-8'>
        <div className='relative flex h-16 items-center justify-between'>
          <div className='flex flex-1 items-center justify-center sm:items-stretch sm:justify-start'>
            <div className='flex flex-shrink-0 items-center'>
              <p className='text-2xl font-bold tracking-tighter text-white'>
                Page Number
              </p>
            </div>
          </div>
          <div className='absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0'>
            <div className='rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white'>
              <span>{pageNumber}</span>
              <span className='text-gray-400'> / {numPages}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
