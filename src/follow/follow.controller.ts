import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/common/guard/jwt-auth.guard';
import { CurrentUser } from '@/common/params/current-user.params';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { FollowService } from './follow.service';
import { ApiCookieAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProtectedRouteSwaggerDoc } from '@/common/utils/protected-route-swagger';

@ApiCookieAuth('access_token')
@UseGuards(JwtAuthGuard)
@ProtectedRouteSwaggerDoc()
@Controller()
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @ApiOperation({ description: 'Follow a user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User followed successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('follow/:followingUserId')
  follow(
    @CurrentUser() payload: JwtPayload,
    @Param('followingUserId') followingUserId: string,
  ) {
    return this.followService.follow({ payload, followingUserId });
  }

  @ApiOperation({ description: 'Unfollow a user' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'User unfollowed successfully',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('unfollow/:followingUserId')
  unfollow(
    @CurrentUser() payload: JwtPayload,
    @Param('followingUserId') followingUserId: string,
  ) {
    return this.followService.unfollow({ payload, followingUserId });
  }
}
