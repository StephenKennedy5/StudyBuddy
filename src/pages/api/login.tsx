/* 
  Endpoint to Check if user exists 
  if exists return users info verification
  if doesnt exist calls to create new user
*/
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

import { fetchCreds, routes } from '@/lib/routes';

export default async function Login(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { name, email } = req.body;

    const getUser = await knex('users').select().where('email', email);
    if (getUser.length === 0) {
      console.log('CREATE USER');
      const createUserResponse = await fetch(routes.createUser(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });

      // Check the response from the createUser endpoint
      if (createUserResponse.ok) {
        console.log('User created successfully');
        console.log({ createUserResponse });
        // Create response for new user that returns ID value
      } else {
        console.error('Failed to create user');
      }
    } else {
      console.log('USER EXISTS');
      console.log('UPDATE JWT TOKEN');
    }
    res.status(200).json(getUser);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}
