/* Component that will return a list of PDFs Objects */
import { useRouter } from 'next/router';
import NewPdf from 'src/components/newPdf';

interface PdfListProps {
  id: string;
  title: string;
  user_id: string;
  upload_date: string;
  updated_date: string;
  AWS_Key: string;
  AWS_Bucket: string;
}

interface PDFProps {
  pdfList: PdfListProps[];
  pdfFile: File | null;
  setPdfFile: React.Dispatch<React.SetStateAction<File | null>>;
}
/*

  Edit So when PDF is clicked on it brings up chat session and view pdf
  U

*/

function PDFS({ pdfList, pdfFile, setPdfFile }: PDFProps) {
  const router = useRouter();
  return (
    <div className=' overflow-y-auto px-[10px]'>
      <div className=' cursor-pointer '>
        <div>
          <NewPdf pdfFile={pdfFile} setPdfFile={setPdfFile} />
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
