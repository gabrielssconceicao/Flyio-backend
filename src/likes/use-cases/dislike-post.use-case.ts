import { BadRequestException, Injectable } from '@nestjs/common';
import { DefaultUseCase } from './default.use-case';
import { Like } from './type';

@Injectable()
export class DislikePostUseCase extends DefaultUseCase<Like, void> {
  async execute({ payload, postId }: Like): Promise<void> {
    await this.postExists(postId);

    const isLiked = await this.isLiked({ payload, postId });
    if (!isLiked) {
      throw new BadRequestException('Post already unliked');
    }

    await this.prisma.likePost.delete({
      where: {
        postId_userId: {
          userId: payload.id,
          postId,
        },
      },
    });
    return;
  }
}
