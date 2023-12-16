import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuid } from 'uuid';

import knex from '../../../database/knex';

const id: string = uuid();

export default async function newUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { name, email } = req.body;
    const newUser = await knex('users').insert([
      {
        id: id,
        name: name,
        email: email,
      },
    ]);

    const newUsers = await knex('users').select().where('email', email);

    res.status(200).json(newUsers);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}
