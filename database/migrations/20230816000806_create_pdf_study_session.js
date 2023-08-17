/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('study_session_pdf_pivot', function (table) {
    table.uuid('id').primary();
    table.uuid('study_session_id').references('id').inTable('study_sessions');
    table.uuid('pdf_id').references('id').inTable('pdfs');
    table.timestamp('upload_date').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('study_session_pdf_pivot');
};
