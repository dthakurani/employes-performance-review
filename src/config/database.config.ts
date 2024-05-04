import { registerAs } from '@nestjs/config';
import { DatabaseConfig } from './config.type';
import {
  IsOptional,
  IsInt,
  Min,
  Max,
  IsString,
  ValidateIf,
  IsBoolean,
} from 'class-validator';
import validateConfig from '../utils/validate-config';

const sqlLoggingMap = {
  true: true,
  false: false,
  query: ['query'],
  error: ['error'],
  schema: ['schema'],
  warn: ['warn'],
  info: ['info'],
  log: ['log'],
  all: 'all',
};
class EnvironmentVariablesValidator {
  @ValidateIf((envValues) => !envValues.SQL_DATABASE_TYPE)
  @IsString()
  SQL_DATABASE_URL: string;

  @ValidateIf((envValues) => !envValues.SQL_DATABASE_TYPE)
  @IsString()
  SQL_DATABASE_TYPE: string;

  @ValidateIf((envValues) => !envValues.SQL_DATABASE_TYPE)
  @IsString()
  SQL_DATABASE_HOST: string;

  @ValidateIf((envValues) => !envValues.SQL_DATABASE_TYPE)
  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  SQL_DATABASE_PORT: number;

  @ValidateIf((envValues) => !envValues.SQL_DATABASE_TYPE)
  @IsString()
  @IsOptional()
  SQL_DATABASE_PASSWORD: string;

  @ValidateIf((envValues) => !envValues.SQL_DATABASE_TYPE)
  @IsString()
  SQL_DATABASE_NAME: string;

  @ValidateIf((envValues) => !envValues.SQL_DATABASE_TYPE)
  @IsString()
  SQL_DATABASE_USERNAME: string;

  @IsBoolean()
  @IsOptional()
  SQL_DATABASE_SYNCHRONIZE: boolean;

  @IsInt()
  @IsOptional()
  SQL_DATABASE_MAX_CONNECTIONS: number;

  @IsBoolean()
  @IsOptional()
  SQL_DATABASE_SSL_ENABLED: boolean;

  @IsBoolean()
  @IsOptional()
  SQL_DATABASE_REJECT_UNAUTHORIZED: boolean;

  @IsString()
  @IsOptional()
  SQL_DATABASE_CA: string;

  @IsString()
  @IsOptional()
  DATABASE_KEY: string;

  @IsString()
  @IsOptional()
  DATABASE_CERT: string;
}

export default registerAs<DatabaseConfig>('database', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    sqlUrl: process.env.SQL_DATABASE_URL!,
    sqlType: process.env.SQL_DATABASE_TYPE!,
    sqlHost: process.env.SQL_DATABASE_HOST!,
    sqlPort: parseInt(process.env.SQL_DATABASE_PORT || '5432', 10),
    sqlPassword: process.env.SQL_DATABASE_PASSWORD,
    sqlName: process.env.SQL_DATABASE_NAME!,
    sqlUsername: process.env.SQL_DATABASE_USERNAME!,
    sqlSynchronize: process.env.SQL_DATABASE_SYNCHRONIZE === 'true',
    sqlMaxConnections: parseInt(
      process.env.SQL_DATABASE_MAX_CONNECTIONS || '100',
      10,
    ),
    sqlSslEnabled: process.env.SQL_DATABASE_SSL_ENABLED === 'true',
    sqlRejectUnauthorized:
      process.env.SQL_DATABASE_REJECT_UNAUTHORIZED === 'true',
    sqlCa: process.env.SQL_DATABASE_CA,
    key: process.env.DATABASE_KEY,
    cert: process.env.DATABASE_CERT,
    sqlLogging: sqlLoggingMap[process.env.SQL_LOGGING || 'error'],
  };
});
