/* GET request of Study Session of a User */
/* Return singluar study session info  */
// Be used to create a map of study sessions on dashboard

import { NextApiRequest, NextApiResponse } from 'next';

import knex from '../../../../../../database/knex';

export default async function GetStudySessions(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const studySessionID = req.query.studySessionId;
    const studySession = await knex('study_sessions')
      .select()
      .where('id', studySessionID)
      .first();

    res.status(200).json(studySession);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}
