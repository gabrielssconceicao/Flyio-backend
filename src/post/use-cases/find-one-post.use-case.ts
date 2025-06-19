import { Injectable, NotFoundException } from '@nestjs/common';
import { UseCase } from '@/common/utils/use-case';
import { FindOnePostEntity } from '../entities';
import { PostMapper } from '../post.mapper';
import { PostParam } from './types';

@Injectable()
export class FindOnePostUseCase extends UseCase<PostParam, FindOnePostEntity> {
  async execute({ postId, payload }: PostParam): Promise<FindOnePostEntity> {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        ...PostMapper.defautFields,
        ...PostMapper.likeFields(payload.id),
        ...PostMapper.commentFields(payload.id),
        ...PostMapper.countField,
        parent: {
          select: {
            ...PostMapper.defautFields,
            ...PostMapper.likeFields(payload.id),
            ...PostMapper.countField,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const { _count, likes, replies, parent, ...restPost } = post;

    return {
      ...restPost,
      ...PostMapper.separate({ _count, likes }),
      comments: replies.map(({ _count, likes, ...reply }) => {
        return {
          ...reply,
          ...PostMapper.separate({ _count, likes }),
        };
      }),
      parent: parent
        ? {
            id: parent.id,
            text: parent.text,
            parentId: parent.parentId,
            createdAt: parent.createdAt,
            author: parent.author,
            images: parent.images,
            ...PostMapper.separate({
              _count: parent._count,
              likes: parent.likes,
            }),
          }
        : null,
    };
  }
}
