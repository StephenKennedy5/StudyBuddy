import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

interface MessageProps {
  role: 'system' | 'assistant' | 'user';
  content: string;
}
interface ChatMessage {
  chat_bot: boolean;
  chat_message: string;
}

const openAiKey = process.env.OPENAI_API_KEY;
if (!openAiKey) {
  throw new Error('OPENAI_API_KEY env variable is needed');
}

const openai = new OpenAI({ apiKey: openAiKey });

export default async function ChatOpenAI(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { chat_message, lastSixMessages } = req.body;

    const message: MessageProps[] = [
      {
        role: 'system',
        content: `You are an expert with decades worth of experience.`,
      },
    ];
    lastSixMessages.forEach((chat: ChatMessage) => {
      const messageObject = chat.chat_bot
        ? { role: 'assistant', content: chat.chat_message }
        : { role: 'user', content: chat.chat_message };

      message.push(messageObject as MessageProps);
    });
    const newMessage = {
      role: 'user',
      content: `${chat_message}`,
    };

    if (chat_message !== undefined) {
      message.push(newMessage as MessageProps);
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: message,
        temperature: 0.7,
      });

      console.log('Response');
      console.log({ response });

      res.status(200).json({ text: `${response.choices[0].message.content}` });
    } else {
      res.status(400).json({ text: 'No chat message provided.' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ text: 'An error occurred' });
  }
}
