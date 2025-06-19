import { Injectable, NotFoundException } from '@nestjs/common';

import { UserUseCase } from './user.use-case';
import { SearchUserEntity } from '../entities';
import { UserMapper } from '../user.mapper';
import { GetFollowingsParam } from './types';

@Injectable()
export class GetFollowersUseCase extends UserUseCase<
  GetFollowingsParam,
  SearchUserEntity
> {
  async execute({
    username,
    query,
  }: GetFollowingsParam): Promise<SearchUserEntity> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const followers = await this.prisma.follow.findMany({
      where: {
        followingUserId: user.id,
      },
      select: {
        follower: {
          select: UserMapper.searchUserFields,
        },
      },
      take: query.limit,
      skip: query.offset,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const count = await this.prisma.follow.count({
      where: {
        followingUserId: user.id,
      },
    });

    return {
      count,
      items: followers.map((follow) => follow.follower),
    };
  }
}
