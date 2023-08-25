/* Cal newPdf API endpoint to upload new pdf */

// Get Title from File being uploaded,
// Use filler content for now for pdf_info
import { useState } from 'react';

function newPdf() {
  const [tileName, setTileName] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      const fileName = file.name;
      setTileName(fileName);
    } else {
      alert('Please choose a valid PDF file.');
    }
  };
  return (
    <div className='mb-[20px] bg-white p-[20px]'>
      <div>
        <input
          type='file'
          accept='.pdf'
          onChange={handleFileChange}
          className='rounded border bg-gray-100 px-4 py-2'
        />
      </div>
    </div>
  );
}

export default newPdf;
