import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai';

const openAiKey = process.env.OPENAI_API_KEY;
if (!openAiKey) {
  throw new Error('OPENAI_API_KEY env variable is needed');
}

const openai = new OpenAI({ apiKey: openAiKey });

export default async function TestOpenAI(req, res) {
  try {
    const { chat_message, studySessionName, studySessionSubject } = req.body;
    console.log('IN OPENAI ENDPOINT');
    console.log(studySessionName);
    console.log(studySessionSubject);

    if (chat_message !== undefined) {
      const message: ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content: `You are an expert in ${studySessionSubject} with decades worth of experience.`,
        },
        {
          role: 'user',
          content: `${chat_message}`,
        },
      ];
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
