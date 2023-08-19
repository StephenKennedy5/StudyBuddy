import { NextApiRequest, NextApiResponse } from 'next';
import knex from '../../../../database/knex';

// Chat logs ID = 129893d8-e859-4a01-9038-04cbf611f72f;
// study session ID = 2aa1c17a-ac46-4566-bd91-d08c8d549bfa;

export default async function GetStudySessions(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const userId = req.query.userid;
    const studySessionId = req.query.studySessionId;
    console.log(userId);
    console.log(studySessionId);
    const studySessions = await knex('study_sessions')
      .select()
      .where('user_id', userId);

    console.log(studySessions);
    res.status(200).json(studySessions);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}
