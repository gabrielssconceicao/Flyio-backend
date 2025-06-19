import { NotFoundException } from '@nestjs/common';
import { UseCase } from '@/common/utils/use-case';
import { PrismaService } from '@/prisma/prisma.service';
import { PostImageStoreUseCase } from '@/image-store/use-cases';
import { PostParam } from './types';

export class DeletePostUseCase extends UseCase<PostParam, void> {
  constructor(
    protected readonly prisma: PrismaService,
    private readonly imageStore: PostImageStoreUseCase,
  ) {
    super(prisma);
  }

  async execute({ postId, payload }: PostParam): Promise<void> {
    const postExists = await this.prisma.post.findUnique({
      where: {
        id: postId,
        authorId: payload.id,
      },
      select: {
        images: {
          select: {
            url: true,
          },
        },
      },
    });

    if (!postExists) {
      throw new NotFoundException('Post not found');
    }

    if (postExists.images.length) {
      await this.imageStore.deletePostImages({
        files: postExists.images.map((image) => image.url),
      });
    }

    await this.prisma.post.delete({
      where: {
        id: postId,
        authorId: payload.id,
      },
    });
    return;
  }
}
