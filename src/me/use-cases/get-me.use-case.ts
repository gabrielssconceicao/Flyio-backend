import { Injectable } from '@nestjs/common';
import { MeUseCase } from './me.use-case';
import { CurrentUserEntity } from '../entities/current-user.entity';
import { MeMapper } from '../me.mapper';
import { Count, Id } from './types';

@Injectable()
export class GetMeUseCase extends MeUseCase {
  async execute({ id }: Id): Promise<{ user: CurrentUserEntity }> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        ...MeMapper.defaultFields,
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
      },
    });

    const { _count, ...userWithoutCount } = user as CurrentUserEntity & Count;
    return {
      user: { ...userWithoutCount, ...MeMapper.separateCount({ _count }) },
    };
  }
}
