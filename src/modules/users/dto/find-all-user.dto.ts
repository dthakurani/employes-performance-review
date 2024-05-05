import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsInt } from 'class-validator';

export class FindAllUserDto {
  @IsOptional()
  @Transform(({ value }) => value.trim())
  @IsString()
  @ApiProperty({
    description: 'Search term for filtering',
    required: false,
    example: 'backend',
  })
  searchString: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Sort',
    example: 'title',
    required: false,
    enum: ['name', 'dateOfJoining'],
  })
  sortBy: 'name' | 'dateOfJoining' = 'name';

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Order',
    example: 'ASC',
    enum: ['ASC', 'DESC'],
    required: false,
  })
  sortOrder: 'ASC' | 'DESC' = 'ASC';

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  @ApiProperty({
    description: 'Page number for pagination',
    required: false,
    example: 1,
  })
  page?: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  @ApiProperty({
    description: 'Number of items per page',
    required: false,
    example: 10,
  })
  limit?: number;
}
