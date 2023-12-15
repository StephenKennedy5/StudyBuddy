import { promises as fs } from 'fs'; // To save the file temporarily
import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server'; // To handle the request and response
import PDFParser from 'pdf2json'; // To parse the pdf
import { v4 as uuidv4 } from 'uuid'; // To generate a unique filename

import knex from './../../../database/knex';

// const uuid = require('uuid');

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function NewPdf(req: NextApiRequest, res: NextApiResponse) {
  const formData: FormData = await req.formData();
  const uploadedFiles = formData.getAll('filepond');
  let fileName = '';
  let parsedText = '';

  if (uploadedFiles && uploadedFiles.length > 0) {
    const uploadedFile = uploadedFiles[1];
    console.log('Uploaded file:', uploadedFile);

    if (uploadedFile instanceof File) {
      fileName = uuidv4();
      const tempFilePath = `/tmp/${fileName}.pdf`;
      const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer());
      await fs.writeFile(tempFilePath, fileBuffer);
      // bypass typing check
      const pdfParser = new (PDFParser as any)(null, 1);
      pdfParser.on('pdfParser_dataError', (errData: any) =>
        console.log(errData.parserError)
      );
      pdfParser.on('pdfParser_dataReady', () => {
        console.log((pdfParser as any).getRawTextContent());
        parsedText = (pdfParser as any).getRawTextContent();
      });

      pdfParser.loadPDF(tempFilePath);
    } else {
      console.log('Uploaded file is not in the expected format');
    }
  } else {
    console.log('File Not Found');
  }
  const response = new NextResponse(parsedText);
  response.headers.set('FileName', fileName);
  return response.status(204);
}
export default NewPdf;
