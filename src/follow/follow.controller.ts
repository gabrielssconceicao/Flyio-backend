import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth } from '@nestjs/swagger';

import { JwtAuthGuard } from '@/common/guard/jwt-auth.guard';
import { CurrentUser } from '@/common/params/current-user.params';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { ProtectedRouteSwaggerDoc } from '@/common/utils/protected-route-swagger';

import { FollowUserSwaggerDoc } from './swagger/follow-swagger';
import { FollowService } from './follow.service';

@ApiCookieAuth('access_token')
@UseGuards(JwtAuthGuard)
@ProtectedRouteSwaggerDoc()
@Controller()
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @FollowUserSwaggerDoc('follow')
  @HttpCode(HttpStatus.CREATED)
  @Post('follow/:followingUserId')
  follow(
    @CurrentUser() payload: JwtPayload,
    @Param('followingUserId') followingUserId: string,
  ) {
    return this.followService.follow({ payload, followingUserId });
  }

  @FollowUserSwaggerDoc('unfollow')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('unfollow/:followingUserId')
  unfollow(
    @CurrentUser() payload: JwtPayload,
    @Param('followingUserId') followingUserId: string,
  ) {
    return this.followService.unfollow({ payload, followingUserId });
  }
}
