import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';

const sqlLoggingMap = {
  true: true,
  false: false,
  query: ['query'],
  error: ['error'],
  schema: ['schema'],
  warn: ['warn'],
  info: ['info'],
  log: ['log'],
};

export const AppDataSource = new DataSource({
  type: process.env.SQL_DATABASE_TYPE,
  url: process.env.DATABASE_URL,
  host: process.env.SQL_DATABASE_HOST,
  port: process.env.SQL_DATABASE_PORT
    ? parseInt(process.env.SQL_DATABASE_PORT, 10)
    : 5432,
  username: process.env.SQL_DATABASE_USERNAME,
  password: process.env.SQL_DATABASE_PASSWORD,
  database: process.env.SQL_DATABASE_NAME,
  synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
  dropSchema: false,
  keepConnectionAlive: true,
  logging: sqlLoggingMap[process.env.SQL_LOGGING || 'error'],
  entities: [__dirname + '/../modules/**/entities/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    entitiesDir: 'src',
    migrationsDir: 'src/database/migrations',
    subscribersDir: 'subscriber',
  },
  extra: {
    // based on https://node-postgres.com/api/pool
    // max connection pool size
    max: process.env.DATABASE_MAX_CONNECTIONS
      ? parseInt(process.env.DATABASE_MAX_CONNECTIONS, 10)
      : 100,
    ssl:
      process.env.DATABASE_SSL_ENABLED === 'true'
        ? {
            rejectUnauthorized:
              process.env.DATABASE_REJECT_UNAUTHORIZED === 'true',
            ca: process.env.DATABASE_CA ?? undefined,
            key: process.env.DATABASE_KEY ?? undefined,
            cert: process.env.DATABASE_CERT ?? undefined,
          }
        : undefined,
  },
} as DataSourceOptions);
