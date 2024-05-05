import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { BcryptService } from 'src/utils/bcrypt';
import { Designation } from '../designations/entities/designation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Designation])],
  controllers: [UsersController],
  providers: [UsersService, BcryptService],
})
export class UsersModule {}
