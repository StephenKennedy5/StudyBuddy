import { NextApiRequest, NextApiResponse } from 'next';

import { fetchCreds, routes } from '@/lib/routes';

import knex from '../../../database/knex';

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
