import knexFactory from 'knex';

import config from '../knexfile';

type KnexConfig = {
  development: {
    client: string;
    connection: {
      host: string;
      database: string;
      user: string;
      password: string;
    };
    migrations: {
      tableName: string;
      directory: string;
    };
  };
};

const environment = process.env.NODE_ENV || 'development';
const knex = knexFactory(config[environment]);

export default knex;
