import { Injectable } from '@nestjs/common';
import { UseCase } from '@/common/utils/use-case';

@Injectable()
export abstract class DefaultFollowUseCase<T, R> extends UseCase<T, R> {
  protected async userExists(username: string): Promise<{ id: string } | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
      },
    });

    return user;
  }
  protected async isFollowing({
    followingUserId,
    followedBy,
  }: {
    followingUserId: string;
    followedBy: string;
  }): Promise<boolean> {
    const isFollowing = await this.prisma.follow.findUnique({
      where: {
        userId_followingUserId: {
          userId: followedBy,
          followingUserId,
        },
      },
    });

    return !!isFollowing;
  }
}
