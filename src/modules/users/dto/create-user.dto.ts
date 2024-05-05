import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from '../users.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Name of the user', example: 'John Doe' })
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'Email of the user',
    example: 'john.doe@example.com',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Phone number of the user',
    example: '1234567890',
  })
  phone: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Address of the user',
    example: '123 Main St, City, Country',
  })
  address: string;

  @IsNotEmpty()
  @IsISO8601({ strict: true })
  @ApiProperty({
    description: 'Date of birth of the user',
    example: '1990-01-01',
  })
  dob: Date;

  @IsNotEmpty()
  @IsISO8601({ strict: true })
  @ApiProperty({
    description: 'Date of joining of the user',
    example: '2020-01-01',
  })
  dateOfJoining: Date;

  @IsNotEmpty()
  @IsEnum(Role)
  @ApiProperty({
    description: 'Role of the user',
    enum: Role,
    enumName: 'Role',
    default: Role.EMPLOYEE,
    example: Role.EMPLOYEE,
  })
  role: Role = Role.EMPLOYEE;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: 'Designation ID of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  designationId: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~])[a-zA-Z\d!@#$%^&*()_+{}[\]:;<>,.?~]{8,20}$/,
    {
      message:
        'Password must contain at least one letter, one number, and one special symbol',
    },
  )
  @ApiProperty({
    description: 'Password of the user',
    example: 'Password@123',
    required: true,
  })
  password: string;
}
