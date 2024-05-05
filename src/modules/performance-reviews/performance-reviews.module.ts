import { Module } from '@nestjs/common';
import { PerformanceReviewsService } from './performance-reviews.service';
import { PerformanceReviewsController } from './performance-reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { PerformanceReview } from './entities/performance-review.entity';
import { PerformanceReviewTopic } from '../performance-review-topics/entities/performance-review-topic.entity';
import { PerformanceReviewTopicMapping } from './entities/performance-review-topic-mapping.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      PerformanceReview,
      PerformanceReviewTopic,
      PerformanceReviewTopicMapping,
    ]),
  ],
  controllers: [PerformanceReviewsController],
  providers: [PerformanceReviewsService],
})
export class PerformanceReviewsModule {}
