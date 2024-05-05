import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BcryptService } from 'src/utils/bcrypt';
import { Repository, EntityManager, Not, ILike } from 'typeorm';
import { User } from './entities/user.entity';
import { Designation } from '../designations/entities/designation.entity';
import { CustomException } from 'src/utils/custom-exception';
import { FindAllUserDto } from './dto/find-all-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Designation)
    private designationsRepository: Repository<Designation>,
    private bcryptService: BcryptService,
    private entityManager: EntityManager,
  ) {}

  async create(body: CreateUserDto) {
    await this.entityManager.transaction(async (entityManager) => {
      const password = await this.bcryptService.hashPassword(body.password);

      const [userAlreadyExists, designation] = await Promise.all([
        this.userRepository.findOne({
          where: [{ email: body.email }, { phone: body.phone }],
          select: ['id'],
        }),

        this.designationsRepository.findOne({
          where: { id: body.designationId },
          select: ['id'],
        }),
      ]);

      if (userAlreadyExists) {
        new CustomException().throwHttpError({
          message: 'User already exists!',
          status: HttpStatus.CONFLICT,
          errorKey: 'email/phone',
        });
      }

      if (!designation) {
        new CustomException().throwHttpError({
          message: 'Designation not found!',
          status: HttpStatus.NOT_FOUND,
          errorKey: 'designationId',
        });
      }

      const user = this.userRepository.create({
        ...body,
        password,
      });

      await entityManager.save(user);
    });

    return;
  }

  async findAll(query: FindAllUserDto) {
    let whereQuery = {};

    if (query.searchString) {
      whereQuery = { name: ILike(`%${query.searchString}%`) };
    }

    const [users, total] = await Promise.all([
      this.userRepository.find({
        where: whereQuery,
        take: query.limit,
        ...(query.page &&
          query.limit && { skip: (query.page - 1) * query.limit }),
        order: {
          [query.sortBy]: query.sortOrder,
        },
      }),

      this.userRepository.count({
        where: whereQuery,
      }),
    ]);

    return {
      entity: users,
      total,
      page: query.page || 1,
      limit: query.limit || null,
    };
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['designation'],
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        dob: true,
        dateOfJoining: true,
        role: true,
        designation: {
          id: true,
          title: true,
          level: true,
          technology: true,
          specialization: true,
        },
      },
    });

    return user;
  }

  async update(id: string, body: UpdateUserDto) {
    await this.entityManager.transaction(async (entityManager) => {
      const whereQuery: object[] = [];

      const userAlreadyExists = await this.userRepository.findOne({
        where: { id },
        select: [
          'id',
          'name',
          'email',
          'address',
          'phone',
          'createdAt',
          'dateOfJoining',
          'dob',
          'designationId',
          'password',
        ],
      });

      if (!userAlreadyExists) {
        new CustomException().throwHttpError({
          message: 'User/Employee not found!',
          status: HttpStatus.NOT_FOUND,
          errorKey: 'id',
        });
      }

      if (body.email) {
        whereQuery.push({ email: body.email, id: Not(id) });
      }
      if (body.phone) {
        whereQuery.push({ phone: body.phone, id: Not(id) });
      }
      if (body.designationId) {
        const designation = await this.designationsRepository.findOne({
          where: { id: body.designationId },
        });

        if (!designation) {
          new CustomException().throwHttpError({
            message: 'Designation not found!',
            status: HttpStatus.NOT_FOUND,
            errorKey: 'designationId',
          });
        }
      }
      if (body.password) {
        const password = await this.bcryptService.hashPassword(body.password);
        body.password = password;
      }

      const user = this.userRepository.create({
        ...userAlreadyExists,
        ...body,
      });

      await entityManager.save(user);
    });
  }

  async remove(id: string) {
    await this.entityManager.transaction(async (entityManager) => {
      const userAlreadyExists = await this.userRepository.findOne({
        where: { id },
        select: ['id'],
      });

      if (!userAlreadyExists) {
        new CustomException().throwHttpError({
          message: 'User/Employee not found!',
          status: HttpStatus.NOT_FOUND,
          errorKey: 'id',
        });
      }

      await entityManager.softRemove(userAlreadyExists);
    });
  }
}
