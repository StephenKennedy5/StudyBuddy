import { NextApiRequest, NextApiResponse } from 'next';

import knex from '../../../database/knex';

export default async function getUsers(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const getUsers = await knex('users').select();

    res.status(200).json(getUsers);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}
