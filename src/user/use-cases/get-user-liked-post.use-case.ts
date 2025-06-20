import { Injectable } from '@nestjs/common';
import { UseCase } from '@/common/utils/use-case';
import { PostMapper } from '@/post/post.mapper';
import { GetLikedPostEntity } from '../entities';
import { PostRelationParam } from './types';

@Injectable()
export class GetUserLikedPostUseCase extends UseCase<
  PostRelationParam,
  GetLikedPostEntity
> {
  async execute({
    payload,
    query,
    username,
  }: PostRelationParam): Promise<GetLikedPostEntity> {
    const { limit = 50, offset = 0 } = query;
    const posts = await this.prisma.likePost.findMany({
      where: {
        user: {
          username,
        },
      },
      select: {
        post: {
          select: {
            ...PostMapper.defautFields,
            ...PostMapper.likeFields(payload.id),
            ...PostMapper.countField,
            parent: {
              select: {
                author: {
                  select: {
                    username: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });
    const count = await this.prisma.likePost.count({
      where: {
        user: {
          username,
        },
      },
    });
    return {
      count,
      items: posts.map(({ post: { _count, likes, ...post } }) => ({
        ...post,
        ...PostMapper.separate({ _count, likes }),
      })),
    };
  }
}
