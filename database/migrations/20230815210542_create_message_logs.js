/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('chat_messages', function (table) {
    table.uuid('id').primary();
    table.uuid('chat_id').references('id').inTable('chat_logs');
    table.text('chat_message');
    table.timestamp('creation_date').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('chat_messages');
};
