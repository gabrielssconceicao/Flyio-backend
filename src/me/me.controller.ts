import {
  Controller,
  Get,
  Patch,
  Delete,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';

import { JwtAuthGuard } from '@/common/guard/jwt-auth.guard';
import { CurrentUser } from '@/common/params/current-user.params';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';

import { MeService } from './me.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserEntity } from '@/user/entities/user.entity';

@UseGuards(JwtAuthGuard)
@ApiResponse({
  status: HttpStatus.UNAUTHORIZED,
  description: 'Invalid token',
  schema: {
    example: {
      statusCode: HttpStatus.UNAUTHORIZED,
      message: 'Invalid token',
      error: 'Unauthorized',
    },
  },
})
@Controller('me')
export class MeController {
  constructor(private readonly meService: MeService) {}

  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User found successfully',
    type: UserEntity,
  })
  @Get()
  getMe(@CurrentUser() user: JwtPayload) {
    return this.meService.getMe(user);
  }

  @Patch()
  update() {
    return 'update me';
  }

  @Delete()
  remove() {
    return 'delete me';
  }
}
