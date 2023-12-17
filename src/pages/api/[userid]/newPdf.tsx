import { NextApiRequest, NextApiResponse } from 'next';

import knex from '../../../../database/knex';

const uuid = require('uuid');

// Extend NextApiRequest type to include file property from multer

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
