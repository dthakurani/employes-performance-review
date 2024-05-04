import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class UserLoginDto {
  @ApiProperty({
    description: 'Email of the user',
    type: String,
    example: 'pramudito@mailinator.com',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    type: String,
    example: 'Password@123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
