import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SendLinkDto {
  @ApiProperty({ description: 'User email', example: 'jonh@example.com' })
  @IsEmail()
  email: string;
}
