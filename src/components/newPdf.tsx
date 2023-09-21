/* Cal newPdf API endpoint to upload new pdf */

// Get Title from File being uploaded,
// Use filler content for now for pdf_info
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

import { fetchCreds, routes } from '@/lib/routes';

function newPdf() {
  const [titleName, setTitleName] = useState(null);
  const { data: session, status } = useSession();
  const userId = session?.user?.sub;

  //   Calls new PDF API endpoint
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      const fileName = file.name;
      setTitleName(fileName);
    } else {
      setTitleName(null);
    }
  };

  const submitFile = async () => {
    if (!titleName) return;
    const pdfTitle = titleName.split('.')[0];
    const pdfText = 'This is a mock statement and filler.';
    const requestBody = {
      pdfTitle,
      pdfText,
    };

    try {
      const response = await fetch(routes.newPdf(userId), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      if (response.ok) {
        console.log('PDF uploaded successfully');
        // Perform any other necessary actions
      } else {
        console.error('PDF upload failed');
      }
    } catch (error) {
      console.error('Error Uploading PDF: ', error);
    }
  };

  return (
    <div className='mb-[20px] flex flex-col'>
      <label
        className={`group relative mt-[20px] inline-flex transform cursor-pointer items-center rounded-[10px]
               bg-white px-[40px] py-[10px] transition duration-300 ease-in-out hover:-translate-y-1
              hover:bg-gray-200 hover:shadow-lg`}
      >
        <div className=' text-center'>
          <span>{titleName === null ? <div>Upload PDF</div> : titleName}</span>
          <input
            type='file'
            accept='.pdf'
            onChange={handleFileChange}
            className='hidden'
          />
        </div>
      </label>
      {titleName === null ? null : (
        <div
          className=' mt-[20px] cursor-pointer rounded-[10px] bg-green-50 px-[40px] py-[10px] text-center'
          onClick={() => submitFile()}
        >
          Submit
        </div>
      )}
    </div>
  );
}

export default newPdf;
