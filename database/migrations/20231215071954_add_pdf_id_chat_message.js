exports.up = function (knex) {
  return knex.schema.alterTable('chat_messages', function (table) {
    // Add the new column pdf_id as UUID
    table.uuid('pdf_id');

    // Add any additional constraints or settings for the new column as needed.
    // For example, you might want to add a foreign key constraint:
    // table.foreign('pdf_id').references('pdfs.id');
  });
};

exports.down = function (knex) {
  // To rollback, simply remove the added column
  return knex.schema.alterTable('chat_messages', function (table) {
    table.dropColumn('pdf_id');
  });
};
