import { BadRequestException, NotFoundException } from '@nestjs/common';
import { DefaultFollowUseCase } from './default.use-case';
import { Follow } from './type';

export class FollowUseCase extends DefaultFollowUseCase {
  async execute({ username, payload }: Follow) {
    if (username === payload.username) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const following = await this.userExists(username);

    if (!following) {
      throw new NotFoundException('User not found');
    }

    const isFollowing = await this.isFollowing({
      followingUserId: following.id,
      followedBy: payload.id,
    });

    if (isFollowing) {
      throw new BadRequestException('You are already following this user');
    }

    await this.prisma.follow.create({
      data: {
        userId: payload.id,
        followingUserId: following.id,
      },
    });
  }
}
