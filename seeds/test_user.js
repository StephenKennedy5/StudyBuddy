/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const uuid = require('uuid');

exports.seed = async function (knex) {
  // Disable foreign key checks
  // await knex.raw('SET session_replication_role = replica;');
  // Delete existing data
  await knex('pdf_user_pivot').del();
  await knex('study_session_pdf_pivot').del();
  await knex('chat_messages').del();
  await knex('pdfs').del();
  await knex('chat_logs').del();
  await knex('study_sessions').del();
  await knex('users').del();

  // Re-enable foreign key checks
  // await knex.raw('SET session_replication_role = DEFAULT;');

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
      chat_log_id: chatLogsId,
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
      user_id: JohnDoeId,
      creation_date: new Date('2023-08-18T12:00:00Z'),
    },
    {
      id: uuid.v4(),
      chat_id: chatLogsId,
      chat_message: 'How would I be able to make an ORM work with nextjs?',
      user_id: JohnDoeId,
      creation_date: new Date('2023-08-18T12:10:00Z'),
    },
    {
      id: uuid.v4(),
      chat_id: chatLogsId,
      chat_message:
        'Can you give me an example of a custom hook in for nextjs?',
      user_id: JohnDoeId,
      creation_date: new Date('2023-08-18T12:20:00Z'),
    },
    {
      id: uuid.v4(),
      chat_id: chatLogsId,
      chat_message: 'Can you please check the following code of mine.',
      user_id: JohnDoeId,
      creation_date: new Date('2023-08-18T12:30:00Z'),
    },
    {
      id: uuid.v4(),
      chat_id: chatLogsId,
      chat_message: 'Sure I can help you with that',
      user_id: StudyBuddyId,
      creation_date: new Date('2023-08-18T12:05:00Z'),
    },
    {
      id: uuid.v4(),
      chat_id: chatLogsId,
      chat_message: 'Follow these intstructions',
      user_id: StudyBuddyId,
      creation_date: new Date('2023-08-18T12:15:00Z'),
    },
    {
      id: uuid.v4(),
      chat_id: chatLogsId,
      chat_message: 'Here is an example of a custom hook for nextjs.',
      user_id: StudyBuddyId,
      creation_date: new Date('2023-08-18T12:25:00Z'),
    },
    {
      id: uuid.v4(),
      chat_id: chatLogsId,
      chat_message: 'The code you provided looks correct.',
      user_id: StudyBuddyId,
      creation_date: new Date('2023-08-18T12:35:00Z'),
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
