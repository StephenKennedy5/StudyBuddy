/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const uuid = require('uuid');

exports.seed = async function (knex) {
  // Delete existing data
  await knex('chat_messages').del();
  await knex('pdfs').del();
  await knex('chat_logs').del();
  await knex('study_session_pdf_pivot').del();
  await knex('pdf_user_pivot').del();
  await knex('study_sessions').del();
  await knex('users').del();

  const JohnDoeId = uuid.v4();
  const StudyBuddyId = uuid.v4();
  const studySessionId = uuid.v4();
  const pdfsId = uuid.v4();
  const chatLogsId = uuid.v4();

  await knex('users').insert([
    {
      id: JohnDoeId,
      name: 'John Doe',
      email: 'JohnDoe@example.com',
    },
    {
      id: StudyBuddyId,
      name: 'Study Buddy',
      email: 'StudyBuddy@chatbot.com',
    },
  ]);
  await knex('study_sessions').insert([
    {
      id: studySessionId,
      user_id: JohnDoeId,
      session_name: 'How to use Next JS',
      subject: 'Computer Science',
    },
  ]);
  await knex('pdfs').insert([
    {
      id: pdfsId,
      title: 'Introduction to Computer Science',
      user_id: JohnDoeId,
      pdf_info:
        'Welcome to the introduction of computer science. This will cover ...',
    },
  ]);
  await knex('chat_logs').insert([
    {
      id: chatLogsId,
      session_id: studySessionId,
      user_id: JohnDoeId,
    },
  ]);
  await knex('chat_messages').insert([
    {
      id: uuid.v4(),
      chat_id: chatLogsId,
      chat_message: 'I need help with understanding the following concept',
    },
    {
      id: uuid.v4(),
      chat_id: chatLogsId,
      chat_message: 'How would I be able to make an ORM work with nextjs?',
    },
    {
      id: uuid.v4(),
      chat_id: chatLogsId,
      chat_message:
        'Can you give me an example of a custom hook in for nextjs?',
    },
    {
      id: uuid.v4(),
      chat_id: chatLogsId,
      chat_message: 'Can you please check the following code of mine.',
    },
  ]);

  await knex('pdf_user_pivot').insert([
    {
      id: uuid.v4(),
      pdf_id: pdfsId,
      user_id: JohnDoeId,
    },
  ]);
  await knex('study_session_pdf_pivot').insert([
    {
      id: uuid.v4(),
      study_session_id: studySessionId,
      pdf_id: pdfsId,
    },
  ]);
};
