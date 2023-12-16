exports.up = function (knex) {
  return knex.schema.alterTable('pdfs', function (table) {
    // Add the new column updated_date with default value and allow it to be updated
    table.timestamp('updated_date').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  // To rollback, remove the added column
  return knex.schema.alterTable('pdfs', function (table) {
    table.dropColumn('updated_date');
  });
};
