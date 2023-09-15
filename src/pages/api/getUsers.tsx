/* End point to get users */
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
