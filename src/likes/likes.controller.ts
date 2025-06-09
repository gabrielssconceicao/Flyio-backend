import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { CurrentUser } from '@/common/params/current-user.params';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { JwtAuthGuard } from '@/common/guard/jwt-auth.guard';
import { ApiCookieAuth, ApiParam, ApiResponse } from '@nestjs/swagger';

@ApiCookieAuth('access_token')
@ApiParam({ name: 'postId', type: String, example: 'id-3', required: true })
@UseGuards(JwtAuthGuard)
@Controller('post')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Post liked successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post(':postId/like')
  likePost(
    @Param('postId') postId: string,
    @CurrentUser() payload: JwtPayload,
  ) {
    return this.likesService.likePost({ postId, payload });
  }

  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Post unliked successfully',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':postId/deslike')
  deslikePost(
    @Param('postId') postId: string,
    @CurrentUser() payload: JwtPayload,
  ) {
    return this.likesService.deslikePost({ postId, payload });
  }
}
