/* Cal newPdf API endpoint to upload new pdf */

// Get Title from File being uploaded,
// Use filler content for now for pdf_info
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

import { fetchCreds, routes } from '@/lib/routes';

function NewPdf() {
  const [titleName, setTitleName] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfProcessing, setPdfProcessing] = useState(false);
  const { data: session, status } = useSession();
  const userId = session?.user?.sub;

  //   Calls new PDF API endpoint
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      console.log({ file });
      const fileName = file.name;
      setTitleName(fileName);
      setPdfFile(file);
    } else {
      setTitleName(null);
    }
  };

  const submitFile = async () => {
    if (!titleName || !pdfFile) return;

    try {
      const formData = new FormData();
      formData.append('file', pdfFile);

      // Log information for debugging
      console.log('Title:', titleName);
      console.log('PDF File:', pdfFile);
      console.log('Form Data:', formData);

      try {
        const response = await fetch(routes.newPdf(userId), {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          console.log('PDF uploaded successfully');
          setTitleName(null);
          // Perform any other necessary actions
        } else {
          console.error('PDF upload failed');
          setTitleName(null);
        }
      } catch (error) {
        console.error('Error Uploading PDF: ', error);
        setTitleName(null);
      }
    } catch (error) {
      console.error('Error processing PDF: ', error);
      setTitleName(null);
    }
  };

  return (
    <div className='mb-[20px] flex flex-col'>
      <label
        className={`group relative mt-[20px] inline-flex transform cursor-pointer items-center justify-center rounded-[10px]
               bg-white px-[40px] py-[10px] text-center transition duration-300 ease-in-out
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
          className=' mt-[20px] cursor-pointer rounded-[10px] bg-green-100 px-[40px] py-[10px] text-center transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-green-50 hover:shadow-lg'
          onClick={(event) => submitFile(event)}
        >
          Submit
        </div>
      )}
    </div>
  );
}

export default NewPdf;
