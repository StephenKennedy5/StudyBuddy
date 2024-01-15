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
    const { pdfTitle, aws_key, aws_bucket, id, aws_url } = req.body;

    const newPdf = await knex('pdfs').insert([
      {
        id: id,
        title: pdfTitle,
        user_id: userId,
        upload_date: new Date(),
        updated_date: new Date(),
        aws_key: aws_key,
        aws_bucket: aws_bucket,
        aws_url: aws_url,
      },
    ]);

    const allPdfs = await knex('pdfs').select().where('user_id', userId);
    res.status(200).json(allPdfs);
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
