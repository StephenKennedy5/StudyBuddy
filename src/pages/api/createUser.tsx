/* End point to create new user */
/*
{
    id: UUID (Generated with Post call)
    name: String (Taken from File)
    email: UUID (Given as param)
}
*/

import { NextApiRequest, NextApiResponse } from 'next';

import knex from '../../../database/knex';

const uuid = require('uuid');

export default async function newUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { name, email } = req.body;
    const newUser = await knex('users').insert([
      {
        id: uuid.v4(),
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
