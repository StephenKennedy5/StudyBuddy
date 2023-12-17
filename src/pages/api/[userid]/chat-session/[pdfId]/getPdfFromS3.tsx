/* Create API Endpoint that returns the last 6 chat messages */
import { NextApiRequest, NextApiResponse } from 'next';

import knex from '../../../../../../database/knex';

export default async function getPdfFromS3(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const userId = req.query.userid;
    const pdfId = req.query.pdfId;

    const pdfInfo = await knex('pdfs').select().where('id', pdfId).first();
    res.status(200).json(pdfInfo);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}
