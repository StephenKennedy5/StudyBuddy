exports.up = function (knex) {
  return Promise.all([
    // Remove foreign key constraints from other tables
    knex.schema.table('chat_messages', function (table) {
      table.dropForeign('study_session_id');
    }),

    knex.schema.table('study_session_pdf_pivot', function (table) {
      table.dropForeign('study_session_id');
    }),

    // Remove foreign key constraint from study_sessions itself if it exists
    knex.schema.hasTable('study_sessions').then((exists) => {
      if (exists) {
        knex.schema.alterTable('study_sessions', function (table) {
          table.dropForeign('chat_log_id');
        });
      }
    }),
  ]);
};

exports.down = function (knex) {
  // This is a "down" migration, so you might want to recreate the foreign key constraints.
  // If you don't need to recreate the constraints in the "down" migration, you can omit this section.
  return Promise.all([
    knex.schema.hasTable('study_sessions').then((exists) => {
      if (exists) {
        knex.schema.alterTable('study_sessions', function (table) {
          table.foreign('chat_log_id').references('chat_logs.id');
        });
      }
    }),

    knex.schema.table('chat_messages', function (table) {
      table.foreign('study_session_id').references('study_sessions.id');
    }),

    knex.schema.table('study_session_pdf_pivot', function (table) {
      table.foreign('study_session_id').references('study_sessions.id');
    }),
  ]);
};
