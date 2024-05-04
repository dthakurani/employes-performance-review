import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Designation } from './entities/designation.entity';
import { FindAllDesignationDto } from './dto/find-all-designation.dto';

@Injectable()
export class DesignationsService {
  constructor(
    @InjectRepository(Designation)
    private readonly designationsRepository: Repository<Designation>,
  ) {}

  async findAll(query: FindAllDesignationDto) {
    let whereQuery = {};

    if (query.searchString) {
      whereQuery = [
        { title: ILike(query.searchString) },
        { level: ILike(query.searchString) },
        { technology: ILike(query.searchString) },
        { specialization: ILike(query.searchString) },
      ];
    }

    const [designations, total] = await Promise.all([
      this.designationsRepository.find({
        where: whereQuery,
        select: ['id', 'title', 'level', 'technology', 'specialization'],
        take: query.limit,
        ...(query.page &&
          query.limit && { skip: (query.page - 1) * query.limit }),
        order: {
          [query.sortBy]: query.sortOrder,
        },
      }),

      this.designationsRepository.count({
        where: whereQuery,
      }),
    ]);

    return {
      entity: designations,
      total,
      page: query.page || 1,
      limit: query.limit || null,
    };
  }
}
