// knex migration file for updating column names

exports.up = function (knex) {
  return knex.schema.alterTable('pdfs', (table) => {
    // Rename columns
    table.renameColumn('AWS_Key', 'aws_key');
    table.renameColumn('AWS_Bucket', 'aws_bucket');
    table.renameColumn('AWS_url', 'aws_url');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('pdfs', (table) => {
    // Revert column names to their original names
    table.renameColumn('aws_key', 'AWS_Key');
    table.renameColumn('aws_bucket', 'AWS_Bucket');
    table.renameColumn('aws_url', 'AWS_url');
  });
};
