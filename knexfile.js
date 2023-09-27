module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: 'localhost',
      database: 'studydb',
      user: 'stephen',
      password: 'buddydb',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './database/migrations',
    },
  },
  production: {
    client: 'pg',
    connection: {
      // Production database connection details
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './database/migrations',
    },
  },
  test: {
    client: 'pg',
    connection: {
      // Test database connection details
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './database/migrations',
    },
  },
};
