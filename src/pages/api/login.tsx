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

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

if (!baseUrl) {
  throw new Error('NEXT_PUBLIC_BASE_URL env variable is needed');
}

export default async function Login(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { name, email } = req.body;
    console.log('Email:', email);
    const getUser = await knex('users').select().where('email', email);
    if (getUser.length === 0) {
      console.log('CREATE USER');
      const createUserResponse = await fetch(`${baseUrl}/api/createUser`, {
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
      } else {
        console.error('Failed to create user');
      }
    } else {
      console.log('UPDATE JWT TOKEN');
    }

    res.status(200).json(getUser);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}
