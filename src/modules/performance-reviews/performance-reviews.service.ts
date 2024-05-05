import { HttpStatus, Injectable } from '@nestjs/common';
import { CreatePerformanceReviewDto } from './dto/create-performance-review.dto';
import { UpdatePerformanceReviewDto } from './dto/update-performance-review.dto';
import { FindAllPerformanceReviewDto } from './dto/find-all-performance-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, ILike, In, Repository } from 'typeorm';
import { PerformanceReview } from './entities/performance-review.entity';
import { PerformanceReviewTopic } from '../performance-review-topics/entities/performance-review-topic.entity';
import { PerformanceReviewTopicMapping } from './entities/performance-review-topic-mapping.entity';
import { CustomException } from 'src/utils/custom-exception';

@Injectable()
export class PerformanceReviewsService {
  constructor(
    @InjectRepository(PerformanceReview)
    private performanceReviewsRepository: Repository<PerformanceReview>,
    @InjectRepository(PerformanceReviewTopic)
    private performanceReviewTopicsRepository: Repository<PerformanceReviewTopic>,
    @InjectRepository(PerformanceReviewTopicMapping)
    private performanceReviewTopicMappingsRepository: Repository<PerformanceReviewTopicMapping>,
    private entityManager: EntityManager,
  ) {}

  async create(body: CreatePerformanceReviewDto) {
    await this.entityManager.transaction(async (entityManager) => {
      const currentDate = new Date(new Date().setHours(0, 0, 0, 0));
      const startDate = new Date(new Date(body.startDate).setHours(0, 0, 0, 0));
      const endDate = new Date(
        new Date(body.endDate).setHours(23, 59, 59, 999),
      );

      if (startDate > endDate) {
        throw new CustomException().throwHttpError({
          message: 'End date must be grated than start date',
          errorKey: 'startDate/endDate',
          status: HttpStatus.BAD_REQUEST,
        });
      }

      if (currentDate > startDate) {
        throw new CustomException().throwHttpError({
          message: 'Can not create performance review for past date',
          errorKey: 'startDate/endDate',
          status: HttpStatus.BAD_REQUEST,
        });
      }

      const topicIds = body.performanceReviewTopics.map((topic) => topic.id);

      const topics = await this.performanceReviewTopicsRepository.find({
        where: {
          id: In(topicIds),
        },
      });

      if (topics.length <= 0) {
        throw new CustomException().throwHttpError({
          message: 'All topics are invalid!',
          errorKey: 'performanceReviewTopics.id(s)',
          status: HttpStatus.BAD_REQUEST,
        });
      }

      const validTopics = body.performanceReviewTopics.filter(
        (performanceReviewTopic) =>
          topics.every((topic) => performanceReviewTopic.id.includes(topic.id)),
      );

      const performanceReview = await entityManager.save(
        this.performanceReviewsRepository.create({
          note: body.note,
          startDate: body.startDate,
          endDate: body.endDate,
        }),
      );

      const performanceReviewTopicMapping = await Promise.all(
        validTopics.map((topic) =>
          this.performanceReviewTopicMappingsRepository.create({
            performanceReviewId: performanceReview.id,
            performanceReviewTopicId: topic.id,
            required: topic.required,
          }),
        ),
      );

      await entityManager.save(performanceReviewTopicMapping);
    });

    return;
  }

  async findAll(query: FindAllPerformanceReviewDto) {
    let whereQuery = {};

    if (query.searchString) {
      whereQuery = { name: ILike(`%${query.searchString}%`) };
    }

    const [performanceReviews, total] = await Promise.all([
      this.performanceReviewsRepository.find({
        where: whereQuery,
        select: ['id', 'note', 'startDate', 'endDate'],
        take: query.limit,
        ...(query.page &&
          query.limit && { skip: (query.page - 1) * query.limit }),
        order: {
          [query.sortBy]: query.sortOrder,
        },
      }),

      this.performanceReviewsRepository.count({
        where: whereQuery,
      }),
    ]);

    return {
      entity: performanceReviews,
      total,
      page: query.page || 1,
      limit: query.limit || null,
    };
  }

  async findOne(id: string) {
    const performanceReview = await this.performanceReviewsRepository.findOne({
      where: { id },
      relations: ['performanceReviewTopicMapping.performanceReviewTopic'],
      select: {
        id: true,
        note: true,
        startDate: true,
        endDate: true,
        performanceReviewTopicMapping: {
          id: true,
          performanceReviewTopic: {
            id: true,
            topic: true,
            description: true,
          },
        },
      },
    });

    return performanceReview;
  }

  async update(id: string, body: UpdatePerformanceReviewDto) {
    await this.entityManager.transaction(async (entityManager) => {
      const performanceReviewAlreadyExists =
        await this.performanceReviewsRepository.findOne({ where: { id } });

      if (!performanceReviewAlreadyExists) {
        throw new CustomException().throwHttpError({
          message: 'Performance review not found',
          errorKey: 'id',
          status: HttpStatus.NOT_FOUND,
        });
      }

      if (body.startDate && body.endDate) {
        if (body.startDate > body.endDate)
          throw new CustomException().throwHttpError({
            message: 'End date must be greater than start date',
            errorKey: 'startDate/endDate',
            status: HttpStatus.BAD_REQUEST,
          });

        performanceReviewAlreadyExists.startDate = body.startDate;
        performanceReviewAlreadyExists.endDate = body.endDate;
      }

      if (body.note) {
        performanceReviewAlreadyExists.note = body.note;
      }

      const topicIdsFromBody = body.performanceReviewTopics?.map(
        (topic) => topic.id,
      );

      if (topicIdsFromBody?.length) {
        const existingTopics =
          await this.performanceReviewTopicMappingsRepository.find({
            where: {
              performanceReviewTopicId: In(topicIdsFromBody),
              performanceReviewId: id,
            },
          });

        const topicsToDelete = existingTopics.filter(
          (topic) => !topicIdsFromBody.includes(topic.performanceReviewTopicId),
        );

        await this.performanceReviewTopicMappingsRepository.remove(
          topicsToDelete,
        );

        const topicsToInsert = body.performanceReviewTopics?.filter(
          (topic) =>
            !existingTopics.some(
              (existingTopic) =>
                existingTopic.performanceReviewTopicId === topic.id,
            ),
        );

        const newTopicMappings = topicsToInsert?.map((topic) => ({
          performanceReviewId: id,
          performanceReviewTopicId: topic.id,
          required: topic.required,
        }));

        if (newTopicMappings?.length) {
          await this.performanceReviewTopicMappingsRepository.insert(
            newTopicMappings,
          );
        }
      }

      await entityManager.save(performanceReviewAlreadyExists);
    });

    return;
  }

  async remove(id: string) {
    const performanceReview = await this.performanceReviewsRepository.findOne({
      where: { id },
    });

    if (!performanceReview) {
      throw new CustomException().throwHttpError({
        message: '',
        errorKey: '',
        status: HttpStatus.NOT_FOUND,
      });
    }

    await this.entityManager.softRemove(performanceReview);
  }
}
