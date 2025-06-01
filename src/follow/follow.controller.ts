import { Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/common/guard/jwt-auth.guard';
import { CurrentUser } from '@/common/params/current-user.params';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { FollowService } from './follow.service';

@UseGuards(JwtAuthGuard)
@Controller()
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post('follow/:followingUserId')
  follow(
    @CurrentUser() payload: JwtPayload,
    @Param('followingUserId') followingUserId: string,
  ) {
    return this.followService.follow({ payload, followingUserId });
  }

  @Delete('unfollow/:followingUserId')
  unfollow(
    @CurrentUser() payload: JwtPayload,
    @Param('followingUserId') followingUserId: string,
  ) {
    return this.followService.unfollow({ payload, followingUserId });
  }
}
