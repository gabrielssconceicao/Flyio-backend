import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DefaultFollowUseCase } from './default.use-case';
import { Follow } from './type';

@Injectable()
export class FollowUseCase extends DefaultFollowUseCase<Follow, void> {
  async execute({ username, payload }: Follow): Promise<void> {
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
