import { NextApiRequest, NextApiResponse } from 'next';

import knex from '../../../../database/knex';

const uuid = require('uuid');

// Extend NextApiRequest type to include file property from multer
interface MulterNextApiRequest extends NextApiRequest {
  file: {
    buffer: Buffer;
    // Add other properties as needed based on your multer configuration
  };
}

/* 
  Take in File Name
  New URL
  Parse New URL for UUID val
  set UUID val to pdf Val
  AWS KEY = NEW URL
  AWS Bucket = study-buddy-dev
  name = FileName
  updated_date = Date.now()
  upload_date = Date.now()
*/

export default async function NewPdf(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const pdfData = 'Mock Data for Now';
    const pdfTitle = 'Mock Title';
    const userId = req.query.userid;
    // const { pdfTitle, pdfText, formData } = req.body;
    // const { formData } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // const fileBuffer = req.file.buffer;
    // const fileText = fileBuffer.toString();
    // console.log('PDF Text: ', fileText);

    // console.log('PDF Form data: ', formData);

    const newPdf = await knex('pdfs').insert([
      {
        id: uuid.v4(),
        title: pdfTitle,
        user_id: userId,
        pdf_info: pdfData,
      },
    ]);

    const allPdfs = await knex('pdfs').select().where('user_id', userId);

    res.status(200).json(allPdfs); // Change to a 204
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
