/* Component that will return a list of PDFs Objects */

interface PDFProps {
  pdfList: PDFListProps[];
}

interface PDFListProps {
  id: string;
  pdf_info: string;
  title: string;
  upload_date: string;
  user_id: string;
}

function PDFS({ pdfList }: PDFProps) {
  return (
    <div>
      <div className=' cursor-pointer'>
        {pdfList.map(({ title, id }) => {
          return (
            <div
              key={id}
              className='mb-[20px] bg-white p-[20px]'
              onClick={() => console.log({ title })}
            >
              <div>{title}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PDFS;
