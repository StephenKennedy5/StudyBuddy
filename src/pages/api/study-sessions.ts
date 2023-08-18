/* GET request of Study Sessions of a User */
/*  User ID = 2aa1c17a-ac46-4566-bd91-d08c8d549bfa    */

import { NextApiRequest, NextApiResponse } from 'next';
import knex from '../../../database/knex';

// export default async function StudySessions(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   try {
//     // Perform a Knex query to retrieve the ID of a study session for a specific user
//     const userId = '2aa1c17a-ac46-4566-bd91-d08c8d549bfa';
//     const studySessions = await knex('study_sessions')
//       .select()
//       .where('user_id', userId);

//     console.log(studySessions); // Output the retrieved study session ID
//     res.status(200).json(studySessions); // Respond with the study session ID
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'An error occurred' });
//   }
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const studySessions = await knex('study_sessions').select();
    res.status(200).json(studySessions);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}
