/* Post Request to make a new study session for a user */
// Make a new chat log table also and add the Study session ID to the chat log table

import { NextApiRequest, NextApiResponse } from 'next';
import knex from '../../../../database/knex';

const uuid = require('uuid');

export default async function PostStudySessions(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const userId = req.query.userid;
    const { session_name, subject } = req.body;
    const newStudySessionId = uuid.v4();
    const studySessions = await knex('study_sessions').insert([
      {
        id: newStudySessionId,
        user_id: userId,
        session_name: session_name,
        subject: subject,
      },
    ]);

    const allStudySessions = await knex('study_sessions')
      .select()
      .where('user_id', userId);

    console.log(newStudySessionId);
    res.status(200).json({ studySessionId: newStudySessionId });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}
