import { Injectable } from '@nestjs/common';
import { UseCase } from '@/common/utils/use-case';
import { PostMapper } from '../post.mapper';
import { FindManyPostEntity } from '../entities/find-many.entity';
import { FindMany } from './types';

@Injectable()
export class FindManyPostUseCase extends UseCase<FindMany, FindManyPostEntity> {
  async execute({ query, payload }: FindMany): Promise<FindManyPostEntity> {
    const { search = '', limit = 50, offset = 0 } = query;

    const posts = await this.prisma.post.findMany({
      where: {
        text: {
          contains: search,
          mode: 'insensitive',
        },
        parentId: null,
      },
      select: {
        ...PostMapper.defautFields,
        ...PostMapper.likeFields(payload.id),
        ...PostMapper.countField,
      },
      take: limit,
      skip: offset,
    });

    const count = await this.prisma.post.count({
      where: {
        parentId: null,
      },
    });

    return {
      count,
      items: posts.map(({ _count, likes, ...post }) => {
        return { ...post, ...PostMapper.separate({ _count, likes }) };
      }),
    };
  }
}
