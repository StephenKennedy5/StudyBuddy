/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('pdf_user_pivot', function (table) {
    table.uuid('id').primary();
    table.uuid('pdf_id').references('id').inTable('pdfs');
    table.uuid('user_id').references('id').inTable('users');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('pdf_study_session_pivot');
};
