import { registerAs } from '@nestjs/config';
import { AuthConfig } from './config.type';
import { IsString } from 'class-validator';
import validateConfig from '../utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  AUTH_JWT_SECRET: string;

  @IsString()
  AUTH_JWT_ACCESS_TOKEN_EXPIRES_IN: string;

  @IsString()
  AUTH_JWT_REFRESH_TOKEN_EXPIRES_IN: string;

  @IsString()
  CRYPT_KEY: string;
}

export default registerAs<AuthConfig>('auth', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    jwtSecret: process.env.AUTH_JWT_SECRET,
    jwtAccessTokenExpiration: process.env.AUTH_JWT_ACCESS_TOKEN_EXPIRES_IN,
    jwtRefreshTokenExpiration: process.env.AUTH_JWT_REFRESH_TOKEN_EXPIRES_IN,
    cryptKey: process.env.CRYPT_KEY,
  };
});
