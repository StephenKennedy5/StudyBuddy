/* Cal newPdf API endpoint to upload new pdf */

// Get Title from File being uploaded,
// Use filler content for now for pdf_info
import { useState } from 'react';

function newPdf() {
  const [titleName, setTitleName] = useState(null);

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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/${process.env.NEXT_PUBLIC_USER_ID}/newPdf`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );
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
    <div className='mb-[20px] mt-[20px]'>
      <div>
        <label
          className={`group relative  inline-flex transform cursor-pointer  items-center rounded-[10px]  bg-white  p-[20px]
              transition duration-300 ease-in-out hover:-translate-y-1
              hover:bg-gray-200 hover:shadow-lg`}
        >
          <span>{titleName === null ? 'Upload File' : titleName}</span>
          <input
            type='file'
            accept='.pdf'
            onChange={handleFileChange} // Call Function that uploads PDF
            className='hidden'
          />
        </label>
        {titleName === null ? null : (
          <div
            className='mt-[10px] cursor-pointer rounded bg-green-50 p-[10px]'
            onClick={() => submitFile()}
          >
            Submit
          </div>
        )}
      </div>
    </div>
  );
}

export default newPdf;
