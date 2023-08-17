/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('pdfs', function (table) {
    table.uuid('id').primary();
    table.text('title');
    table.uuid('user_id').references('id').inTable('users');
    table.text('pdf_info');
    table.timestamp('upload_date').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('pdfs');
};
