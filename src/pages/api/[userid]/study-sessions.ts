/* GET request of Study Sessions of a User */
/*  const userId = '7992b5f0-a06f-4b8a-a1be-439ef807a5a1'; */
// Be used to create a map of study sessions on dashboard

import { NextApiRequest, NextApiResponse } from 'next';

import knex from '../../../../database/knex';

export default async function GetStudySessions(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const userId = req.query.userid;
    const studySessions = await knex('study_sessions')
      .select()
      .where('user_id', userId)
      .orderBy('updated_date', 'desc');

    console.log(studySessions);

    res.status(200).json(studySessions);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}
