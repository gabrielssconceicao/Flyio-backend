import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { QueryParamDto } from '@/common/dto/query-param.dto';

type CreatePost = {
  createPostDto: CreatePostDto;
  payload: JwtPayload;
};

type DeletePost = {
  payload: JwtPayload;
  postId: string;
};

type FindAll = {
  payload: JwtPayload;
  query: QueryParamDto;
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

  async findOne({ postId, payload }: { postId: string; payload: JwtPayload }) {
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
        likes: {
          where: {
            userId: payload?.id,
          },

          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const { _count, likes, ...restPost } = post;
    return {
      ...restPost,
      ...this.separate({ _count, likes }),
    };
  }

  async findAll({ payload, query }: FindAll) {
    const { search = '', limit = 50, offset = 0 } = query;

    const posts = await this.prisma.post.findMany({
      where: {
        text: {
          contains: search,
          mode: 'insensitive',
        },
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
        likes: {
          where: {
            userId: payload.id,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
      take: limit,
      skip: offset,
    });

    const count = await this.prisma.post.count();

    return {
      count,
      posts: posts.map(({ _count, likes, ...post }) => {
        return { ...post, ...this.separate({ _count, likes }) };
      }),
    };
  }

  private separate({
    _count,
    likes,
  }: {
    likes: { userId: string }[];
    _count: { likes: number };
    userId?: string;
  }) {
    return {
      likes: _count.likes,
      isLiked: !!likes.length,
    };
  }
}
