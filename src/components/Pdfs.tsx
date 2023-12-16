/* Component that will return a list of PDFs Objects */
import { useRouter } from 'next/router';
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

/*

  Edit So when PDF is clicked on it brings up chat session and view pdf
  U

*/

function PDFS({ pdfList }: PDFProps) {
  const router = useRouter();
  return (
    <div className=' overflow-y-auto px-[10px]'>
      <div className=' cursor-pointer '>
        <div>
          <NewPdf />
        </div>
        {pdfList.map(({ title, id }) => {
          return (
            <div
              key={id}
              className={`
              group mb-[20px] transform rounded-[10px] bg-gray-100 p-[20px]
              transition duration-300 ease-in-out hover:-translate-y-1
              hover:bg-gray-200 hover:shadow-lg
            `}
              onClick={() => router.push(`/chat-session/${id}`)}
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
