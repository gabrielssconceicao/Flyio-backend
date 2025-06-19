import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Follow } from './type';
import { DefaultFollowUseCase } from './default.use-case';

@Injectable()
export class UnfollowUseCase extends DefaultFollowUseCase<Follow, void> {
  async execute({ username, payload }: Follow): Promise<void> {
    if (username === payload.username) {
      throw new BadRequestException('You cannot unfollow yourself');
    }

    const following = await this.userExists(username);

    if (!following) {
      throw new NotFoundException('User not found');
    }

    const isFollowing = await this.isFollowing({
      followingUserId: following.id,
      followedBy: payload.id,
    });

    if (!isFollowing) {
      throw new BadRequestException('You already unfollow this user');
    }

    await this.prisma.follow.delete({
      where: {
        userId_followingUserId: {
          userId: payload.id,
          followingUserId: following.id,
        },
      },
    });
  }
}
