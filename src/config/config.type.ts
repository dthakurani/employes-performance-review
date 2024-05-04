export enum Environment {
  Local = 'local',
  Staging = 'staging',
  Development = 'development',
  Production = 'production',
}

export type AppConfig = {
  nodeEnv: string;
  port: number;
  apiPrefix: string;
};

export type AuthConfig = {
  jwtSecret?: string;
  jwtAccessTokenExpiration?: string;
  jwtRefreshTokenExpiration?: string;
  cryptKey?: string;
};

export type DatabaseConfig = {
  sqlUrl?: string;
  sqlType?: string;
  sqlHost?: string;
  sqlPort?: number;
  sqlPassword?: string;
  sqlName?: string;
  sqlUsername?: string;
  sqlSynchronize?: boolean;
  sqlMaxConnections?: number;
  sqlSslEnabled?: boolean;
  sqlRejectUnauthorized?: boolean;
  sqlCa?: string;
  key?: string;
  cert?: string;
  sqlLogging?: SqlLogging;
};

export type AllConfigType = {
  app: AppConfig;
  auth: AuthConfig;
  database: DatabaseConfig;
};

export enum SqlLogging {
  QUERY = 'query', // Logs all queries.
  ERROR = 'error', // Logs all failed queries.
  SCHEMA = 'schema', // Logs all schema build events.
  WARN = 'warn', // Logs all queries that take longer than the slow query execution threshold.
  INFO = 'info', // Logs all query logs.
  LOG = 'log', // Logs all query logs.
  ALL = 'all', // Logs all query logs.
  TRUE = 'true', // Enables the query log.
  FALSE = 'false', // Disables the query log.
}
