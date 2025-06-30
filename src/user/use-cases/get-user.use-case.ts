import { Injectable, NotFoundException } from '@nestjs/common';

import { FindOneUserEntity } from '../entities';
import { UserMapper } from '../user.mapper';
import { GetUserParam } from './types';
import { UserUseCase } from './user.use-case';

@Injectable()
export class GetUserUseCase extends UserUseCase<
  GetUserParam,
  { user: FindOneUserEntity }
> {
  async execute({
    username,
  }: GetUserParam): Promise<{ user: FindOneUserEntity }> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: UserMapper.findUserFields,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { _count, ...rest } = user;

    return {
      user: {
        ...rest,
        ...UserMapper.separateCount({ _count }),
      },
    };
  }
}
