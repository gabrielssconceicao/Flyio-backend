import {
  Controller,
  Get,
  Patch,
  Delete,
  UseGuards,
  HttpStatus,
  Body,
  HttpCode,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { JwtAuthGuard } from '@/common/guard/jwt-auth.guard';
import { CurrentUser } from '@/common/params/current-user.params';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';

import { UpdateMeDto } from './dto/update-me.dto';
import { MeService } from './me.service';
import { CurrentUserEntity } from './entities/current-user.entity';

@ApiCookieAuth('access_token')
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
    type: CurrentUserEntity,
  })
  @Get()
  getMe(@CurrentUser() payload: JwtPayload) {
    return this.meService.getMe(payload);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User updated successfully',
    type: CurrentUserEntity,
  })
  @Patch()
  updateMe(
    @CurrentUser() payload: JwtPayload,
    @Body() updateMeDto: UpdateMeDto,
  ) {
    return this.meService.updateMe({ payload, updateMeDto });
  }

  @ApiOperation({ summary: 'Desactivate current user' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'User desactivated successfully',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  desactivateMe(@CurrentUser() payload: JwtPayload) {
    return this.meService.desactivateMe(payload);
  }
}
