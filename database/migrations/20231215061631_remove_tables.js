exports.up = function (knex) {
  return Promise.all([
    knex.schema.dropTableIfExists('study_sessions'),
    knex.schema.dropTableIfExists('chat_logs'),
  ]);
};

exports.down = function (knex) {
  // This is a "down" migration, so you might want to recreate the tables.
  // If you don't need to recreate the tables in the "down" migration, you can omit this section.
  return Promise.all([
    knex.schema.createTable('study_sessions', function (table) {
      table.uuid('id').primary();
      table.uuid('user_id');
      table.string('session_name').notNullable();
      table.string('subject').notNullable();
      table.timestamp('creation_date').defaultTo(knex.fn.now());
      table.timestamp('updated_date').defaultTo(knex.fn.now());
      table.uuid('chat_log_id');
      // Add any additional columns and constraints as needed.

      // Foreign key reference
      table.foreign('chat_log_id').references('chat_logs.id');
    }),

    knex.schema.createTable('chat_logs', function (table) {
      table.uuid('id').primary();
      table.uuid('session_id');
      table.timestamp('creation_date').defaultTo(knex.fn.now());
      table.timestamp('updated_date').defaultTo(knex.fn.now());
      table.uuid('user_id');
      // Add any additional columns and constraints as needed.

      // Foreign key reference
      table.foreign('session_id').references('study_sessions.id');
    }),
  ]);
};
