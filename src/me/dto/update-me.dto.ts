import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateMeDto {
  @ApiProperty({
    description: 'User name',
    example: 'John Doe',
    minLength: 3,
    maxLength: 50,
    nullable: true,
  })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  @MaxLength(50, { message: 'Name must be at most 50 characters long' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'User password',
    example: 'password',
    minLength: 6,
    maxLength: 50,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(50, { message: 'Password must be at most 50 characters long' })
  password?: string;

  @ApiProperty({
    description: 'User bio',
    example: 'I am a bio',
    maxLength: 200,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'Bio must be at most 200 characters long' })
  bio?: string;
}
