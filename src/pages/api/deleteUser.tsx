import { NextApiRequest, NextApiResponse } from 'next';

import knex from '../../../database/knex';

export default async function deleteUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.query;
    console.log('ID:', id);
    const deleteUser = await knex('users').where('id', id).del();

    res.status(200).json(deleteUser);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}
