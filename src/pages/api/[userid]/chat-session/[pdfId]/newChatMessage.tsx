import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuid } from 'uuid';

// import { Configuration, OpenAIApi } from 'openai';
import { fetchCreds, routes } from '@/lib/routes';

import knex from '../../../../../../database/knex';

export default async function NewChatMessage(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const userId = req.query.userid;
    const pdfId = req.query.pdfId;
    const { chat_message, lastSixMessages } = req.body;

    // Create a timestamp for the user's chat message
    const userMessageCreationDate = new Date();

    // Start a Knex transaction
    await knex.transaction(async (trx) => {
      // Insert the user's chat message with the custom creation_date
      await trx('chat_messages').insert({
        id: uuid(),
        chat_message: chat_message,
        user_id: userId,
        pdf_id: pdfId,
        chat_bot: false,
        creation_date: userMessageCreationDate,
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

      const chatBotMessageCreationDate = new Date();

      // Insert the chat bot's response with the custom creation_date
      await trx('chat_messages').insert({
        id: uuid(),
        chat_message: result.text,
        user_id: userId,
        pdf_id: pdfId,
        chat_bot: true,
        creation_date: chatBotMessageCreationDate,
      });

      await trx('pdfs')
        .where('id', pdfId)
        .update({ updated_date: chatBotMessageCreationDate });

      // Commit the transaction
      await trx.commit();
    });

    // Fetch and return chat messages
    const chat_messages = await knex('chat_messages')
      .select()
      .where('pdf_id', pdfId)
      .orderBy('creation_date');

    res.status(200).json(chat_messages);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}
