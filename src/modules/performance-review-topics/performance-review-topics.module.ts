import { Module } from '@nestjs/common';
import { PerformanceReviewTopicsService } from './performance-review-topics.service';
import { PerformanceReviewTopicsController } from './performance-review-topics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerformanceReviewTopic } from './entities/performance-review-topic.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PerformanceReviewTopic, User])],
  controllers: [PerformanceReviewTopicsController],
  providers: [PerformanceReviewTopicsService],
})
export class PerformanceReviewTopicsModule {}
