/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.table('study_sessions', function (table) {
    // Drop the foreign key constraint
    table.dropForeign('user_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.table('study_sessions', function (table) {
    // Recreate the foreign key constraint
    table.foreign('user_id').references('users.id');
  });
};
