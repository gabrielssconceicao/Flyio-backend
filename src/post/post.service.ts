import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { QueryParamDto } from '@/common/dto/query-param.dto';
import { ImageStoreService } from '@/image-store/image-store.service';
import { ImageStoreTypeFolder } from '@/image-store/image-store.constants';
import { PostMapper } from './post.mapper';
import { CreatePostDto } from './dto/create-post.dto';
import { PostEntity } from './entities/post.entity';

type CreatePost = {
  createPostDto: CreatePostDto;
  payload: JwtPayload;
  images: Express.Multer.File[];
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
  constructor(
    private readonly prisma: PrismaService,
    private readonly imageStore: ImageStoreService,
  ) {}

  async create({
    createPostDto,
    payload,
    images,
  }: CreatePost): Promise<PostEntity> {
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
        images: {
          createMany: {
            data: imagesUrl.map((url) => ({ url })),
          },
        },
      },
      select: PostMapper.defautFields,
    });

    return post;
  }

  async delete({ payload, postId }: DeletePost): Promise<void> {
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

    // delete post images
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

  async findOne({
    postId,
    payload,
  }: {
    postId: string;
    payload: JwtPayload;
  }): Promise<PostEntity> {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        ...PostMapper.defautFields,
        ...PostMapper.likeFields(payload.id),
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const { _count, likes, ...restPost } = post;
    return {
      ...restPost,
      ...PostMapper.separate({ _count, likes }),
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
        ...PostMapper.defautFields,
        ...PostMapper.likeFields(payload.id),
      },
      take: limit,
      skip: offset,
    });

    const count = await this.prisma.post.count();

    return {
      count,
      posts: posts.map(({ _count, likes, ...post }) => {
        return { ...post, ...PostMapper.separate({ _count, likes }) };
      }),
    };
  }
}
