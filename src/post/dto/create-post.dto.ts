import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    description: 'Post text content',
    example: 'This is a post',
    minLength: 1,
    maxLength: 150,
  })
  @IsNotEmpty({ message: 'Content is required' })
  @MinLength(1, { message: 'Content must be at least 1 character long' })
  @MaxLength(150, { message: 'Content must be at most 150 characters long' })
  content: string;
}
