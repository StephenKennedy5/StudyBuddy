/* Component that will return a list of PDFs Objects */
import NewPdf from 'src/components/newPdf';

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
        <div>
          <NewPdf />
        </div>
        {pdfList.map(({ title, id }) => {
          return (
            <div
              key={id}
              className={`
              group mb-[20px] transform rounded-[10px] bg-white p-[20px]
              transition duration-300 ease-in-out hover:-translate-y-1
              hover:bg-gray-200 hover:shadow-lg
            `}
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
