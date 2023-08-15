/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('study_sessions', function (table) {
    table.uuid('id').primary();
    table.uuid('user_id').references('id').inTable('users');
    table.string('session_name').notNullable();
    table.string('subject').notNullable();
    table.timestamp('creation_date').defaultTo(knex.fn.now());
    table.timestamp('updated_date').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('study_sessions');
};
