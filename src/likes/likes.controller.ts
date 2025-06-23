import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiParam } from '@nestjs/swagger';
import { CurrentUser } from '@/common/params/current-user.params';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { JwtAuthGuard } from '@/common/guard/jwt-auth.guard';
import { LikesService } from './likes.service';
import { LikePostSwaggerDoc } from './swagger/likes-swagger';

@ApiCookieAuth('access_token')
@ApiParam({ name: 'postId', type: String, example: 'id-3', required: true })
@UseGuards(JwtAuthGuard)
@Controller('post')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @LikePostSwaggerDoc('like')
  @HttpCode(HttpStatus.CREATED)
  @Post(':postId/like')
  likePost(
    @Param('postId') postId: string,
    @CurrentUser() payload: JwtPayload,
  ) {
    return this.likesService.like({ postId, payload });
  }

  @LikePostSwaggerDoc('dislike')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':postId/deslike')
  deslikePost(
    @Param('postId') postId: string,
    @CurrentUser() payload: JwtPayload,
  ) {
    return this.likesService.deslike({ postId, payload });
  }
}
