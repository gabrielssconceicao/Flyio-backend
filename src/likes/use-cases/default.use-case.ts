import { NotFoundException } from '@nestjs/common';
import { UseCase } from '@/common/utils/use-case';
import { Like } from './type';

export abstract class DefaultUseCase<T, R> extends UseCase<T, R> {
  protected async postExists(postId: string): Promise<void> {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
  }

  protected async isLiked({ payload, postId }: Like): Promise<boolean> {
    const like = await this.prisma.likePost.findUnique({
      where: {
        postId_userId: {
          userId: payload.id,
          postId,
        },
      },
    });
    return !!like;
  }
}
