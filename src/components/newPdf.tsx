import { PutObjectCommand } from '@aws-sdk/client-s3';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import { FilePond } from 'react-filepond';

import 'filepond/dist/filepond.min.css';

import { fetchCreds, routes } from '@/lib/routes';

interface NewPdfProps {
  pdfFile: File | null;
  setPdfFile: React.Dispatch<React.SetStateAction<File | null>>;
}

function NewPdf({ pdfFile, setPdfFile }: NewPdfProps) {
  const [titleName, setTitleName] = useState<string | null>(null);
  // const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfProcessing, setPdfProcessing] = useState(false);
  const [pdfContent, setPdfContent] = useState('');
  const { data: session, status } = useSession();
  const userId = session?.user?.sub;

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { files } = event.target;

    console.log(files);
    if (files && files[0]) {
      const fileName = files[0].name;
      setTitleName(fileName);
      setPdfFile(files[0]);
    } else {
      setTitleName(null);
    }
    return;
  };

  const submitFile = async (event: React.MouseEvent<HTMLDivElement>) => {
    if (!titleName || !pdfFile) return;
    console.log({ pdfFile });

    try {
      const formData = new FormData();
      formData.append('file', pdfFile);

      try {
        const response = await fetch(routes.newPdf(userId), {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          setTitleName(null);
          setPdfFile(null);
          console.log('PDF uploaded successfully');
          // Perform any other necessary actions
        } else {
          setTitleName(null);
          setPdfFile(null);
          console.error('PDF upload failed');
        }
      } catch (error) {
        setTitleName(null);
        setPdfFile(null);
        console.error('Error Uploading PDF: ', error);
      }
    } catch (error) {
      setTitleName(null);
      setPdfFile(null);
      console.error('Error processing PDF: ', error);
    }
  };

  return (
    <div className='mb-[20px] flex flex-col'>
      <label
        className={`group relative mt-[20px] inline-flex transform cursor-pointer items-center justify-center rounded-[10px]
               bg-gray-100 px-[40px] py-[10px] text-center transition duration-300 ease-in-out
              hover:-translate-y-1 hover:bg-gray-200 hover:shadow-lg`}
      >
        <div className=' text-center'>
          <span>{titleName === null ? <div>Upload PDF</div> : titleName}</span>
          <input
            type='file'
            accept='.pdf'
            onChange={handleFileChange}
            className='hidden'
            id='FileToUpload'
          />
        </div>
      </label>
      {titleName === null ? null : (
        <div
          className=' mt-[20px] cursor-pointer rounded-[10px] bg-green-100 px-[20px] py-[10px] text-center transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-green-50 hover:shadow-lg'
          onClick={(event) => submitFile(event)}
        >
          Submit
        </div>
      )}
    </div>
  );
}

export default NewPdf;
