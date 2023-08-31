/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.table('pdf_user_pivot', function (table) {
    table.dropForeign('pdf_id');
    table.dropForeign('user_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.table('pdf_user_pivot', function (table) {
    table.foreign('pdf_id').references('pdfs.id');
    table.foreign('user_id').references('users.id');
  });
};
