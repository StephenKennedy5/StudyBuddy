exports.up = async function (knex) {
  // Drop foreign key references
  await knex.schema.alterTable('study_session_pdf_pivot', (table) => {
    table.dropForeign('pdf_id');
  });

  // Drop the pivot table
  await knex.schema.dropTableIfExists('study_session_pdf_pivot');

  // Alter the pdfs table
  await knex.schema.alterTable('pdfs', (table) => {
    // Drop the existing columns
    table.dropColumn('pdf_info');

    // Add new columns
    table.text('AWS_Key').notNullable().defaultTo('');
    table.text('AWS_Bucket').notNullable().defaultTo('');
  });
};

exports.down = async function (knex) {
  // Reverse the changes if needed
  await knex.schema.alterTable('pdfs', (table) => {
    // Drop the new columns
    table.dropColumn('AWS_Key');
    table.dropColumn('AWS_Bucket');

    // Add back the old columns
    table.text('pdf_info');
  });

  // Recreate the dropped pivot table and foreign key references
  await knex.schema.createTable('study_session_pdf_pivot', (table) => {
    table
      .uuid('study_session_id')
      .references('id')
      .inTable('study_sessions')
      .onDelete('CASCADE');
    table.uuid('pdf_id').references('id').inTable('pdfs').onDelete('CASCADE');
  });
};
