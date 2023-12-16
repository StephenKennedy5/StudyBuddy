exports.up = function (knex) {
  return knex.schema.alterTable('chat_messages', function (table) {
    // Remove the columns chat_id and study_session_id
    table.dropColumn('chat_id');
    table.dropColumn('study_session_id');
  });
};

exports.down = function (knex) {
  // To rollback, add the columns back to the table
  return knex.schema.alterTable('chat_messages', function (table) {
    table.uuid('chat_id');
    table.uuid('study_session_id');

    // Add any additional constraints or settings for the columns as needed.
    // For example, you might want to add foreign key constraints.
    // table.foreign('chat_id').references('chats.id');
    // table.foreign('study_session_id').references('study_sessions.id');
  });
};
