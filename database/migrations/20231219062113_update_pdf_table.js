// In your migration file (e.g., add_aws_url_column.js)

exports.up = function (knex) {
  return knex.schema.table('pdfs', function (table) {
    // Add a new column named AWS_url of type text
    table.text('AWS_url');
  });
};

exports.down = function (knex) {
  return knex.schema.table('pdfs', function (table) {
    // Rollback: Remove the AWS_url column
    table.dropColumn('AWS_url');
  });
};
