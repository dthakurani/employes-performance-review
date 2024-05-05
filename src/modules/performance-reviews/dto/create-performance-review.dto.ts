import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  ValidateNested,
  IsUUID,
  IsString,
  ValidateIf,
} from 'class-validator';

class PerformanceReviewTopicDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: 'ID of the performance review topic',
    example: 'c0b7ae69-2b3d-4da9-a062-0b757ee3437e',
  })
  id: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Flag indicating whether this topic is required',
    example: true,
    default: false,
  })
  required?: boolean;
}

export class CreatePerformanceReviewDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Note for the performance review',
    example: 'Provide feedback on employee performance',
  })
  note: string;

  @IsNotEmpty()
  @IsISO8601({ strict: true })
  @ApiProperty({
    description: 'Start date of the performance review',
    example: '2024-05-10',
  })
  startDate: Date;

  @IsNotEmpty()
  @IsISO8601({ strict: true })
  @ApiProperty({
    description: 'End date of the performance review',
    example: '2024-05-20',
  })
  endDate: Date;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PerformanceReviewTopicDto)
  @ApiProperty({
    description: 'List of performance review topics',
    type: PerformanceReviewTopicDto,
    isArray: true,
  })
  performanceReviewTopics: PerformanceReviewTopicDto[];
}
