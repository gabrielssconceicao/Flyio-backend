import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DefaultFollowUseCase {
  constructor(protected readonly prisma: PrismaService) {}

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
