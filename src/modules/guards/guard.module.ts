import { Global, Module } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { CryptoService } from '../../utils/crypto';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../../config/config.type';
import { RoleGuard } from './role.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        secret: configService.getOrThrow('auth.jwtSecret', {
          infer: true,
        }),
        signOptions: {
          expiresIn: configService.getOrThrow('auth.jwtAccessTokenExpiration', {
            infer: true,
          }),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthGuard, CryptoService, JwtService, RoleGuard],
  exports: [AuthGuard, CryptoService, RoleGuard],
})
export class GuardsModule {}
