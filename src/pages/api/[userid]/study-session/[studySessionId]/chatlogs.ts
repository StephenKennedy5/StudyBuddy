import { NextApiRequest, NextApiResponse } from 'next';

import knex from '../../../../../../database/knex';

// Chat logs ID = 80d2fb15-0df8-44b6-b389-2e817f7b82b5;
// study session ID = 8f2d1990-fd62-4171-bc9f-0bd435552a2c;

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
