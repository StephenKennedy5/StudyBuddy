/* End Point to delete User PDF */

import { NextApiRequest, NextApiResponse } from 'next';

import knex from '../../../../database/knex';

export default async function GetStudySessions(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const pdfId = req.query.id;
    const userId = req.query.userid;

    const deletedRows = await knex('pdfs').where('id', pdfId).del();

    if (deletedRows > 0) {
      const getPdfs = await knex('pdfs').select().where('user_id', userId);
      res.status(200).json(getPdfs);
    } else {
      res.status(404).json({ success: false, message: 'PDF not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}
