/* End Point to get Users List of PDFs */

import { NextApiRequest, NextApiResponse } from 'next';

import knex from '../../../../database/knex';

export default async function GetStudySessions(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const userId = req.query.userid;
    const getPdfs = await knex('pdfs')
      .select()
      .where('user_id', userId)
      .orderBy('updated_date', 'desc');

    res.status(200).json(getPdfs);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}
