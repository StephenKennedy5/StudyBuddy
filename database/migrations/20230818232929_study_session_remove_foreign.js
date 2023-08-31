/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.table('study_sessions', (table) => {
    table.dropForeign('chat_log_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.table('study_sessions', (table) => {
    table.foreign('chat_log_id').references('chat_logs(id)');
  });
};
