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

    if (pdfInfo) {
      const s3Url = `https://${pdfInfo.aws_bucket}.s3.us-east-1.amazonaws.com/${pdfInfo.aws_key}`;
      res.status(200).json(s3Url);
    } else {
      res.status(404).json({ error: 'PDF not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}
