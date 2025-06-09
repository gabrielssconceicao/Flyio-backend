import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { PrismaService } from '@/prisma/prisma.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

type Like = {
  postId: string;
  payload: JwtPayload;
};

@Injectable()
export class LikesService {
  constructor(private readonly prisma: PrismaService) {}

  async likePost({ payload, postId }: Like) {
    await this.postExists(postId);

    const isLiked = await this.isLiked({ payload, postId });
    if (isLiked) {
      throw new BadRequestException('Post already liked');
    }

    await this.prisma.likePost.create({
      data: {
        userId: payload.id,
        postId,
      },
    });
  }

  async deslikePost({ payload, postId }: Like) {
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
  }

  private async postExists(postId: string) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
  }

  private async isLiked({ payload, postId }: Like): Promise<boolean> {
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
