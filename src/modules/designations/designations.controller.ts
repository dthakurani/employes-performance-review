import {
  Controller,
  Get,
  HttpStatus,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { DesignationsService } from './designations.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommonHelper } from '../common/common.helper';
import { AuthGuard } from '../guards/auth.guard';
import { FindAllDesignationDto } from './dto/find-all-designation.dto';
import { Request, Response } from 'express';

@ApiBearerAuth('Bearer')
@ApiTags('Designations')
@Controller({
  path: 'designations',
  version: '1',
})
export class DesignationsController {
  constructor(
    private readonly designationsService: DesignationsService,
    private readonly commonHelper: CommonHelper,
  ) {}

  @UseGuards(AuthGuard)
  @ApiOperation({ description: 'List all Designations' })
  @Get()
  async findAll(
    @Req() req: Request,
    @Res() res: Response,
    @Query() query: FindAllDesignationDto,
  ) {
    try {
      const data = await this.designationsService.findAll(query);

      return this.commonHelper.apiResponseHandler({
        res,
        data,
        status: HttpStatus.OK,
      });
    } catch (error) {
      if (!error.errorMessage) {
        console.error(
          'designations findAll error :\n',
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
