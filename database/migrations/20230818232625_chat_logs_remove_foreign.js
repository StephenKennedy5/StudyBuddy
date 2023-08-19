/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.table('chat_logs', (table) => {
    table.dropForeign('session_id');
    table.dropForeign('user_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.table('chat_logs', (table) => {
    table.foreign('session_id').references('study_sessions(id)');
    table.foreign('user_id').references('users(id)');
  });
};
