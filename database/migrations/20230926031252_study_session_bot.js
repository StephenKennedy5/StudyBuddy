/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.table('chat_messages', function (table) {
    table.boolean('chat_bot'); // Add the chat_bot column without a default value
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.table('chat_messages', function (table) {
    table.dropColumn('chat_bot'); // Remove the chat_bot column
  });
};
