import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { AllConfigType } from '../config/config.type';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService<AllConfigType>) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.configService.get('database.sqlType', { infer: true }),
      url: this.configService.get('database.sqlUrl', { infer: true }),
      host: this.configService.get('database.sqlHost', { infer: true }),
      port: this.configService.get('database.sqlPort', { infer: true }),
      username: this.configService.get('database.sqlUsername', {
        infer: true,
      }),
      password: this.configService.get('database.sqlPassword', {
        infer: true,
      }),
      database: this.configService.get('database.sqlName', { infer: true }),
      synchronize: this.configService.get('database.sqlSynchronize', {
        infer: true,
      }),
      dropSchema: false,
      keepConnectionAlive: true,
      logging: this.configService.get('database.sqlLogging', { infer: true }),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      cli: {
        entitiesDir: 'src',
        migrationsDir: 'src/database/migrations',
        subscribersDir: 'subscriber',
      },
      extra: {
        // based on https://node-postgres.com/apis/pool
        // max connection pool size
        max: this.configService.get('database.sqlMaxConnections', {
          infer: true,
        }),
        ssl: this.configService.get('database.sqlSslEnabled', {
          infer: true,
        })
          ? {
              rejectUnauthorized: this.configService.get(
                'database.sqlRejectUnauthorized',
                { infer: true },
              ),
              ca:
                this.configService.get('database.sqlCa', { infer: true }) ??
                undefined,
              key:
                this.configService.get('database.key', { infer: true }) ??
                undefined,
              cert:
                this.configService.get('database.cert', { infer: true }) ??
                undefined,
            }
          : undefined,
      },
    } as TypeOrmModuleOptions;
  }
}
