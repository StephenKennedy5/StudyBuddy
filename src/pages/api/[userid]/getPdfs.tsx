/* End Point to get Users List of PDFs */

import { NextApiRequest, NextApiResponse } from 'next';
import knex from '../../../../database/knex';

export default async function GetStudySessions(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const userId = req.query.userid;
    console.log(userId);
    const getPdfs = await knex('pdfs').select().where('user_id', userId);

    console.log(getPdfs);
    res.status(200).json(getPdfs);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}