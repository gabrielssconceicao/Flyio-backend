import { Injectable } from '@nestjs/common';
import { UseCase } from '@/common/utils/use-case';
import { PrismaService } from '@/prisma/prisma.service';
import { ImageStoreTypeFolder } from '@/image-store/image-store.constants';
import { PostImageStoreUseCase } from '@/image-store/use-cases';

import { CommentPostEntity } from '../entities';
import { PostMapper } from '../post.mapper';
import { CommentPost } from './types';

@Injectable()
export class ReplyPostUseCase extends UseCase<CommentPost, CommentPostEntity> {
  constructor(
    protected readonly prisma: PrismaService,
    private readonly imageStore: PostImageStoreUseCase,
  ) {
    super(prisma);
  }
  async execute({
    createPostDto,
    images,
    payload,
    postId,
  }: CommentPost): Promise<CommentPostEntity> {
    let imagesUrl: string[] = [];

    if (images.length) {
      imagesUrl = await this.imageStore.uploadPostImages({
        files: images,
        folder: ImageStoreTypeFolder.POST,
      });
    }

    const post = await this.prisma.post.create({
      data: {
        text: createPostDto.content,
        authorId: payload.id,
        parentId: postId,
        images: {
          createMany: {
            data: imagesUrl.map((url) => ({ url })),
          },
        },
      },
      select: {
        ...PostMapper.defautFields,
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
    });

    return { ...post, likes: 0, isLiked: false, replies: 0 };
  }
}
