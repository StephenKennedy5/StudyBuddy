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
    const userId = req.query.userid;
    const { pdfTitle, AWS_key, AWS_bucket, id } = req.body;

    const newPdf = await knex('pdfs').insert([
      {
        id: id,
        title: pdfTitle,
        user_id: userId,
        upload_date: new Date(),
        updated_date: new Date(),
        AWS_Key: AWS_key,
        AWS_Bucket: AWS_bucket,
      },
    ]);

    const allPdfs = await knex('pdfs').select().where('user_id', userId);
    console.log({ allPdfs });
    res.status(200).json(allPdfs); // Change to a 204
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};
