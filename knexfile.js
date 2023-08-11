module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: 'localhost',
      database: 'studydb',
      user: 'stephen',
      password: 'buddydb',
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './database/migrations',
    },
  },
};
