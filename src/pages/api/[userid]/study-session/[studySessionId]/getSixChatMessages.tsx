/* Create API Endpoint that returns the last 6 chat messages */
import { NextApiRequest, NextApiResponse } from 'next';

import knex from '../../../../../../database/knex';

export default async function getLatestChatLogs(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const userId = req.query.userid;
    const studySessionId = req.query.studySessionId;

    const chat_messages = await knex('chat_messages')
      .select()
      .where('study_session_id', studySessionId)
      .orderBy('creation_date', 'desc')
      .limit(6);
    res.status(200).json(chat_messages);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}
