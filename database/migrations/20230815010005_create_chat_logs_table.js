/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('chat_logs', function (table) {
    table.uuid('id').primary();
    table.uuid('session_id').references('id').inTable('study_sessions');
    table.timestamp('creation_date').defaultTo(knex.fn.now());
    table.timestamp('updated_date').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('chat_logs');
};
