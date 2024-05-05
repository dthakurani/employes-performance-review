import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
  HttpStatus,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommonHelper } from '../common/common.helper';
import { Request, Response } from 'express';
import { AuthGuard } from '../guards/auth.guard';
import { Roles } from 'src/decorators/role.decorator';
import { FindAllUserDto } from './dto/find-all-user.dto';
import { RoleGuard } from '../guards/role.guard';

@ApiBearerAuth('Bearer')
@ApiTags('Users')
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly commonHelper: CommonHelper,
  ) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ADMIN')
  @ApiOperation({ description: 'Create a new user in system' })
  @Post()
  async create(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: CreateUserDto,
  ) {
    try {
      await this.usersService.create(body);

      return this.commonHelper.apiResponseHandler({
        res,
        data: {},
        message: 'User created successfully!',
        status: HttpStatus.CREATED,
      });
    } catch (error) {
      if (!error.errorMessage) {
        console.error(
          'users create error :\n',
          new Date().toISOString(),
          error,
        );
      }

      return this.commonHelper.apiErrorHandler({
        req,
        res,
        error,
      });
    }
  }

  @UseGuards(AuthGuard)
  @ApiOperation({ description: 'List of users/employees' })
  @Get()
  async findAll(
    @Req() req: Request,
    @Res() res: Response,
    @Query() query: FindAllUserDto,
  ) {
    try {
      const data = await this.usersService.findAll(query);

      return this.commonHelper.apiResponseHandler({
        res,
        data,
        message: '',
        status: HttpStatus.OK,
      });
    } catch (error) {
      if (!error.errorMessage) {
        console.error(
          'users findAll error :\n',
          new Date().toISOString(),
          error,
        );
      }

      return this.commonHelper.apiErrorHandler({
        req,
        res,
        error,
      });
    }
  }

  @UseGuards(AuthGuard)
  @ApiOperation({ description: 'Get details of user' })
  @Get(':id')
  async findOne(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    try {
      const data = await this.usersService.findOne(id);

      return this.commonHelper.apiResponseHandler({
        res,
        data,
        message: '',
        status: HttpStatus.OK,
      });
    } catch (error) {
      if (!error.errorMessage) {
        console.error(
          'users findOne error :\n',
          new Date().toISOString(),
          error,
        );
      }

      return this.commonHelper.apiErrorHandler({
        req,
        res,
        error,
      });
    }
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ADMIN')
  @Patch(':id')
  @ApiOperation({ description: 'Update existing user/employee in system' })
  async update(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateUserDto,
  ) {
    try {
      await this.usersService.update(id, body);

      return this.commonHelper.apiResponseHandler({
        res,
        data: {},
        message: 'User/Employee updated successfully',
        status: HttpStatus.OK,
      });
    } catch (error) {
      if (!error.errorMessage) {
        console.error(
          'users update error :\n',
          new Date().toISOString(),
          error,
        );
      }

      return this.commonHelper.apiErrorHandler({
        req,
        res,
        error,
      });
    }
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ADMIN')
  @ApiOperation({ description: 'Delete user/employee that exists in system' })
  @Delete(':id')
  async remove(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    try {
      await this.usersService.remove(id);

      return this.commonHelper.apiResponseHandler({
        res,
        data: {},
        message: 'User/Employee deleted successfully',
        status: HttpStatus.OK,
      });
    } catch (error) {
      if (!error.errorMessage) {
        console.error(
          'users remove error :\n',
          new Date().toISOString(),
          error,
        );
      }

      return this.commonHelper.apiErrorHandler({
        req,
        res,
        error,
      });
    }
  }
}
