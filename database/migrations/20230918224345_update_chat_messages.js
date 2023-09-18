/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  // Remove the existing foreign key constraint
  return knex.schema
    .alterTable('chat_messages', function (table) {
      table.dropForeign('chat_id');
    })
    .then(() => {
      // Add a new foreign key constraint referencing study_sessions(id)
      return knex.schema.alterTable('chat_messages', function (table) {
        table
          .uuid('study_session_id')
          .references('id')
          .inTable('study_sessions');
      });
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  // Reverse the migration: remove the new foreign key constraint
  return knex.schema
    .alterTable('chat_messages', function (table) {
      table.dropForeign('study_session_id');
    })
    .then(() => {
      // Add back the old foreign key constraint referencing chat_logs(id)
      return knex.schema.alterTable('chat_messages', function (table) {
        table.uuid('chat_id').references('id').inTable('chat_logs');
      });
    });
};
