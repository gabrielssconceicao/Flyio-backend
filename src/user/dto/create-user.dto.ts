import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  @MaxLength(50, { message: 'Name must be at most 20 characters long' })
  @ApiProperty({
    description: 'User name',
    example: 'John Doe',
    minLength: 3,
    maxLength: 50,
  })
  name: string;

  @IsNotEmpty({ message: 'Username is required' })
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @MaxLength(50, { message: 'Username must be at most 20 characters long' })
  @ApiProperty({
    description: 'User username',
    example: 'jDoe',
    minLength: 3,
    maxLength: 50,
  })
  username: string;

  @IsNotEmpty({ message: 'Name is required' })
  @IsEmail()
  @ApiProperty({
    description: 'User email',
    example: 'jonh@example.com',
  })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(50, { message: 'Password must be at most 20 characters long' })
  @ApiProperty({
    description: 'User password',
    example: 'password',
    minLength: 6,
    maxLength: 50,
  })
  password: string;

  @IsOptional()
  @MaxLength(200, { message: 'Bio must be at most 200 characters long' })
  @ApiProperty({
    description: 'User bio',
    example: "John Doe's bio",
    maxLength: 200,
    nullable: true,
  })
  bio?: string;
}
