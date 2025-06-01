import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { PrismaService } from '@/prisma/prisma.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

export type Follow = {
  payload: JwtPayload;
  followingUserId: string;
};

@Injectable()
export class FollowService {
  constructor(private readonly prisma: PrismaService) {}

  async follow({ followingUserId, payload }: Follow) {
    if (followingUserId === payload.id) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const following = await this.userExists(followingUserId);

    if (!following) {
      throw new NotFoundException('User not found');
    }

    const isFollowing = await this.isFollowing({
      followingUserId,
      followedBy: payload.id,
    });

    if (isFollowing) {
      throw new BadRequestException('You are already following this user');
    }

    await this.prisma.follow.create({
      data: {
        userId: payload.id,
        followingUserId,
      },
    });
  }
  async unfollow({ followingUserId, payload }: Follow) {
    if (followingUserId === payload.id) {
      throw new BadRequestException('You cannot unfollow yourself');
    }

    const user = await this.userExists(followingUserId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isFollowing = await this.isFollowing({
      followingUserId,
      followedBy: payload.id,
    });

    if (!isFollowing) {
      throw new BadRequestException('You already unfollow this user');
    }

    await this.prisma.follow.delete({
      where: {
        userId_followingUserId: {
          userId: payload.id,
          followingUserId,
        },
      },
    });
  }

  private async userExists(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    return !!user;
  }
  private async isFollowing({
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
