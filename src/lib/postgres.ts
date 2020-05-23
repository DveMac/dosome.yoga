import { default as knex, default as Knex } from 'knex';

const dev = process.env.NODE_ENV !== 'production';
const knexCache: { [key: string]: Knex } = {};

export const withKnex = async <T>(key: string, fn: (knex: Knex) => Promise<any>): Promise<T> => {
  if (!knexCache[key]) {
    const params = {
      host: process.env.DB_HOST,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: Number(process.env.DB_PORT || '5432'),
    };
    const db = knex({
      client: 'pg',
      connection: {
        ssl: dev
          ? false
          : {
              rejectUnauthorized: false,
            },
        host: params.host,
        user: params.username,
        password: params.password,
        database: params.database,
        port: params.port,
      },
    });
    knexCache[key] = db;
  }
  return await fn(knexCache[key]);
};
