import { Module } from '@nestjs/common';
import { DesignationsController } from './designations.controller';
import { DesignationsService } from './designations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Designation } from './entities/designation.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Designation])],
  controllers: [DesignationsController],
  providers: [DesignationsService],
})
export class DesignationsModule {}
