import { Injectable } from '@nestjs/common';
import { UseCase } from '@/common/utils/use-case';
import { PostMapper } from '@/post/post.mapper';
import { PostRelationParam } from './types';
import { GetUserPostsEntity } from '../entities';

@Injectable()
export class GetUserPostsUseCase extends UseCase<
  PostRelationParam,
  GetUserPostsEntity
> {
  async execute({
    query,
    username,
    payload,
  }: PostRelationParam): Promise<GetUserPostsEntity> {
    const { limit = 50, offset = 0 } = query;
    const posts = await this.prisma.post.findMany({
      where: {
        author: {
          username,
        },
      },
      select: {
        ...PostMapper.defautFields,
        ...PostMapper.likeFields(payload.id),
        ...PostMapper.countField,
        ...PostMapper.parentField,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    const count = await this.prisma.post.count({
      where: {
        author: {
          username,
        },
      },
    });
    return {
      count,
      items: posts.map(({ _count, likes, ...post }) => ({
        ...post,
        ...PostMapper.separate({ _count, likes }),
      })),
    };
  }
}
