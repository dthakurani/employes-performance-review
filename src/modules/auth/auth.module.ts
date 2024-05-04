import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { BcryptService } from '../../utils/bcrypt';
import { CryptoService } from '../../utils/crypto';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Session } from '../users/entities/session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Session])],
  controllers: [AuthController],
  providers: [AuthService, BcryptService, CryptoService],
  exports: [AuthService],
})
export class AuthModule {}
