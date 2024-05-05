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
} from '@nestjs/common';
import { PerformanceReviewsService } from './performance-reviews.service';
import { CreatePerformanceReviewDto } from './dto/create-performance-review.dto';
import { UpdatePerformanceReviewDto } from './dto/update-performance-review.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommonHelper } from '../common/common.helper';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { Roles } from 'src/decorators/role.decorator';
import { Request, Response } from 'express';
import { FindAllPerformanceReviewDto } from './dto/find-all-performance-review.dto';

@ApiBearerAuth('Bearer')
@ApiTags('Performance Reviews')
@Controller({
  path: 'performance-reviews',
  version: '1',
})
export class PerformanceReviewsController {
  constructor(
    private readonly performanceReviewsService: PerformanceReviewsService,
    private readonly commonHelper: CommonHelper,
  ) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ADMIN')
  @ApiOperation({ description: 'Create new performance review' })
  @Post()
  async create(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: CreatePerformanceReviewDto,
  ) {
    try {
      await this.performanceReviewsService.create(body);

      return this.commonHelper.apiResponseHandler({
        res,
        data: {},
        message: 'Performance review created successfully!',
        status: HttpStatus.CREATED,
      });
    } catch (error) {
      if (!error.errorMessage) {
        console.error(
          'performanceReviews create error :\n',
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
  @ApiOperation({ description: 'List all performance review' })
  @Get()
  async findAll(
    @Req() req: Request,
    @Res() res: Response,
    @Body() query: FindAllPerformanceReviewDto,
  ) {
    try {
      const data = await this.performanceReviewsService.findAll(query);

      return this.commonHelper.apiResponseHandler({
        res,
        data,
        message: '',
        status: HttpStatus.OK,
      });
    } catch (error) {
      if (!error.errorMessage) {
        console.error(
          'performanceReviews findAll error :\n',
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
  @ApiOperation({ description: 'Get details for a performance review' })
  @Get(':id')
  async findOne(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    try {
      const data = await this.performanceReviewsService.findOne(id);

      return this.commonHelper.apiResponseHandler({
        res,
        data,
        message: '',
        status: HttpStatus.OK,
      });
    } catch (error) {
      if (!error.errorMessage) {
        console.error(
          'performanceReviews findOne error :\n',
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
  @ApiOperation({ description: 'Update existing performance review' })
  @Patch(':id')
  async update(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
    @Body() body: UpdatePerformanceReviewDto,
  ) {
    try {
      await this.performanceReviewsService.update(id, body);

      return this.commonHelper.apiResponseHandler({
        res,
        data: {},
        message: 'Performance review updated successfully!',
        status: HttpStatus.OK,
      });
    } catch (error) {
      if (!error.errorMessage) {
        console.error(
          'performanceReviews update error :\n',
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
  @ApiOperation({ description: 'Delete existing performance review' })
  @Delete(':id')
  async remove(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    try {
      await this.performanceReviewsService.remove(id);

      return this.commonHelper.apiResponseHandler({
        res,
        data: {},
        message: 'Performance review Deleted successfully!',
        status: HttpStatus.OK,
      });
    } catch (error) {
      if (!error.errorMessage) {
        console.error(
          'performanceReviews remove error :\n',
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
