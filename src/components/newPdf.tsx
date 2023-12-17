import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import { useS3Upload } from 'next-s3-upload';
import { useState } from 'react';

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
  const { uploadToS3 } = useS3Upload();
  const userId = session?.user?.sub;
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { files } = event.target;

    if (files && files[0]) {
      const fileName = files[0].name;
      const fileNameWithoutExtension = fileName.replace(/\.[^/.]+$/, '');
      setTitleName(fileNameWithoutExtension);
      setPdfFile(files[0]);
    } else {
      setTitleName(null);
      setPdfFile(null);
    }
    return;
  };

  const submitFile = async (event: React.MouseEvent<HTMLDivElement>) => {
    if (!titleName || !pdfFile) return;

    const { url } = await uploadToS3(pdfFile);
    const match = url.match(/\/next-s3-uploads\/([^\/]+)/);
    const pdfId = match ? match[1] : '';

    try {
      const requestBody = {
        pdfTitle: titleName,
        AWS_key: url,
        AWS_bucket: 'study-buddy-dev',
        id: pdfId,
      };

      const response = await fetch(routes.newPdf(userId), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        console.log({ jsonResponse }); // All PDFs
        queryClient.invalidateQueries({
          queryKey: ['ChatSessionPDFS', userId],
        });
        router.push(`/chat-session/${pdfId}`);
      }
    } catch (error) {
      console.error('Error making new PDF: ', error);
    }

    setTitleName(null);
    setPdfFile(null);
    return;
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
