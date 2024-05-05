import {
  Controller,
  Get,
  HttpStatus,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PerformanceReviewTopicsService } from './performance-review-topics.service';
import { CommonHelper } from '../common/common.helper';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { Roles } from 'src/decorators/role.decorator';
import { FindAllPerformanceReviewTopicsDyo } from './dto/find-all-performance-review-topic.dto';

@ApiBearerAuth('Bearer')
@ApiTags('Performance Review Topics')
@Controller({
  path: 'performance-review-topics',
  version: '1',
})
export class PerformanceReviewTopicsController {
  constructor(
    private readonly performanceReviewTopicsService: PerformanceReviewTopicsService,
    private readonly commonHelper: CommonHelper,
  ) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Roles('ADMIN')
  @Get()
  async findAll(
    @Req() req: Request,
    @Res() res: Response,
    @Query() query: FindAllPerformanceReviewTopicsDyo,
  ) {
    try {
      const data = await this.performanceReviewTopicsService.findAll(query);

      return this.commonHelper.apiResponseHandler({
        res,
        data,
        message: '',
        status: HttpStatus.OK,
      });
    } catch (error) {
      if (!error.errorMessage) {
        console.error(
          'performanceReviewTopics findAll error :\n',
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
