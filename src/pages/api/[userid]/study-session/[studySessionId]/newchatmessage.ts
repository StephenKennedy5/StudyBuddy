import { NextApiRequest, NextApiResponse } from 'next';
import knex from '../../../../../../database/knex';

// Chat logs ID = 80d2fb15-0df8-44b6-b389-2e817f7b82b5;
// study session ID = 8f2d1990-fd62-4171-bc9f-0bd435552a2c;

/* Add a new chat message to the chat log */
// Need create new chat message to insert with user_id, chat_logs_id, creation_Date, message

const uuid = require('uuid');

export default async function GetStudySessions(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const userId = req.query.userid;
    const studySessionId = req.query.studySessionId;
    const { chat_message } = req.body;
    const { chat_log_id } = await knex('study_sessions')
      .select()
      .where('id', studySessionId)
      .first();

    const new_chat_message = await knex('chat_messages').insert({
      id: uuid.v4(),
      chat_id: chat_log_id,
      chat_message: chat_message,
      user_id: userId,
    });

    const chat_messages = await knex('chat_messages')
      .select()
      .where('chat_id', chat_log_id)
      .orderBy('creation_date');

    res.status(200).json(chat_messages);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}
