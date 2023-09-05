/* End point for user to upload new PDF */
/* Get PDF title from file drop for testing */

/*
{
    id: UUID (Generated with Post call)
    title: String (Taken from File)
    user_id: UUID (Given as param)
    pdf_info: Text (??)
    upload_date: timestamp (Generated at time of Creation)
}
*/

import { NextApiRequest, NextApiResponse } from 'next';

import knex from '../../../../database/knex';

const uuid = require('uuid');

export default async function NewPdf(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const userId = req.query.userid;
    const { pdfTitle, pdfText } = req.body;
    const newPdf = await knex('pdfs').insert([
      {
        id: uuid.v4(),
        title: pdfTitle,
        user_id: userId,
        pdf_info: pdfText,
      },
    ]);

    const allPdfs = await knex('pdfs').select().where('user_id', userId);

    res.status(200).json(allPdfs); // Change to a 204
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}
