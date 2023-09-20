import { NextApiRequest, NextApiResponse } from 'next';

import knex from '../../../../../../database/knex';

/* Return an array of chat messages ordered by creation_date */

export default async function GetStudySessions(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const userId = req.query.userid;
    const studySessionId = req.query.studySessionId;

    const chat_messages = await knex('chat_messages')
      .select()
      .where('study_session_id', studySessionId)
      .orderBy('creation_date');
    res.status(200).json(chat_messages);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}
