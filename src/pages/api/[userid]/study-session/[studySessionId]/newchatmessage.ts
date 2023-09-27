import { NextApiRequest, NextApiResponse } from 'next';

// import { Configuration, OpenAIApi } from 'openai';
import { fetchCreds, routes } from '@/lib/routes';

import knex from '../../../../../../database/knex';

/* 
CREATE OR REPLACE FUNCTION update_study_session_updated_date()
RETURNS TRIGGER AS $$
BEGIN
    -- Debugging: Log a message to see if the trigger is activated
    RAISE NOTICE 'Trigger activated for study_session_id: %', NEW.study_session_id;

    -- Update the updated_date column with the current timestamp
    UPDATE study_sessions
    SET updated_date = NOW()
    WHERE id = NEW.study_session_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
*/

/* Add a new chat message to the chat log */
// Need create new chat message to insert with user_id, chat_logs_id, creation_Date, message

const uuid = require('uuid');

export default async function NewChatMessage(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const userId = req.query.userid;
    const studySessionId = req.query.studySessionId;
    const { chat_message, studySessionName, studySessionSubject } = req.body;

    console.log(req.body);

    console.log(studySessionName);
    console.log(studySessionSubject);

    // Create a timestamp for the user's chat message
    const userMessageCreationDate = new Date();

    // Start a Knex transaction
    await knex.transaction(async (trx) => {
      // Insert the user's chat message with the custom creation_date
      await trx('chat_messages').insert({
        id: uuid.v4(),
        chat_message: chat_message,
        user_id: userId,
        study_session_id: studySessionId,
        chat_bot: false,
        creation_date: userMessageCreationDate, // Set the custom creation_date
      });

      // Call OpenAI API and get the response
      const call_openai_api = await fetch(routes.openAiMessage(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });

      const result = await call_openai_api.json();

      // Create a timestamp for the chat bot's message
      const chatBotMessageCreationDate = new Date();

      // Insert the chat bot's response with the custom creation_date
      await trx('chat_messages').insert({
        id: uuid.v4(),
        chat_message: result.text,
        user_id: userId,
        study_session_id: studySessionId,
        chat_bot: true,
        creation_date: chatBotMessageCreationDate, // Set the custom creation_date
      });

      await trx('study_sessions')
        .where('id', studySessionId)
        .update({ updated_date: chatBotMessageCreationDate });

      // Commit the transaction
      await trx.commit();
    });

    // Fetch and return chat messages
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
