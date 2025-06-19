import { Injectable, NotFoundException } from '@nestjs/common';

import { UserUseCase } from './user.use-case';
import { SearchUserEntity } from '../entities';
import { UserMapper } from '../user.mapper';
import { GetFollowingsParam } from './types';

@Injectable()
export class GetFollowingsUseCase extends UserUseCase<
  GetFollowingsParam,
  SearchUserEntity
> {
  async execute({
    username,
    query,
  }: GetFollowingsParam): Promise<SearchUserEntity> {
    const { limit = 20, offset = 0 } = query;

    const user = await this.prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const following = await this.prisma.follow.findMany({
      where: {
        userId: user.id,
      },
      select: {
        followed: {
          select: UserMapper.searchUserFields,
        },
      },
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const count = await this.prisma.follow.count({
      where: {
        userId: user.id,
      },
    });

    return {
      count,
      items: following.map((follow) => follow.followed),
    };
  }
}
