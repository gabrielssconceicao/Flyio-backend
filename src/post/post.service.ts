import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';

type CreatePost = {
  createPostDto: CreatePostDto;
  payload: JwtPayload;
};

type DeletePost = {
  payload: JwtPayload;
  postId: string;
};

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async create({ createPostDto, payload }: CreatePost) {
    const post = await this.prisma.post.create({
      data: {
        text: createPostDto.content,
        authorId: payload.id,
      },
      select: {
        id: true,
        text: true,
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            profileImg: true,
          },
        },
      },
    });

    return { post };
  }

  async delete({ payload, postId }: DeletePost): Promise<void> {
    const postExists = !!(await this.prisma.post.findUnique({
      where: {
        id: postId,
        authorId: payload.id,
      },
    }));

    if (!postExists) {
      throw new NotFoundException('Post not found');
    }

    await this.prisma.post.delete({
      where: {
        id: postId,
        authorId: payload.id,
      },
    });
    return;
  }

  async findOne({ postId }: { postId: string }) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        id: true,
        text: true,
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            profileImg: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return { post };
  }
}
