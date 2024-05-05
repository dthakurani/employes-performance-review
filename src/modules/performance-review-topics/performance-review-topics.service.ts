import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { PerformanceReviewTopic } from './entities/performance-review-topic.entity';
import { FindAllPerformanceReviewTopicsDto } from './dto/find-all-performance-review-topic.dto';

@Injectable()
export class PerformanceReviewTopicsService {
  constructor(
    @InjectRepository(PerformanceReviewTopic)
    private readonly performanceReviewTopicsRepository: Repository<PerformanceReviewTopic>,
  ) {}

  async findAll(query: FindAllPerformanceReviewTopicsDto) {
    let whereQuery = {};

    if (query.searchString) {
      whereQuery = { topic: ILike(`%${query.searchString}%`) };
    }

    const [topics, total] = await Promise.all([
      this.performanceReviewTopicsRepository.find({
        where: whereQuery,
        select: ['id', 'topic', 'description'],
        take: query.limit,
        ...(query.page &&
          query.limit && { skip: (query.page - 1) * query.limit }),
        order: {
          [query.sortBy]: query.sortOrder,
        },
      }),

      this.performanceReviewTopicsRepository.count({
        where: whereQuery,
      }),
    ]);

    return {
      entity: topics,
      total,
      page: query.page || 1,
      limit: query.limit || null,
    };
  }
}
