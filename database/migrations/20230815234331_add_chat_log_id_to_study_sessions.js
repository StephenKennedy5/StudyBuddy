/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.table('study_sessions', function (table) {
    // Add the chat_log_id column as a foreign key referencing chat_logs.id
    table.uuid('chat_log_id').references('id').inTable('chat_logs');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.table('study_sessions', function (table) {
    // Drop the chat_log_id column
    table.dropColumn('chat_log_id');
  });
};
