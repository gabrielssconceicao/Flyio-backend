import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { QueryParamDto } from '@/common/dto/query-param.dto';
import { PostImageStoreUseCase } from '@/image-store/use-cases';
import { ImageStoreTypeFolder } from '@/image-store/image-store.constants';
import { PostMapper } from './post.mapper';
import { CreatePostDto } from './dto/create-post.dto';
import { PostEntity } from './entities/post.entity';
import { FindManyPostEntity } from './entities/find-many.entity';
import { FindOnePostEntity } from './entities/find-one-post.entity';
import { CommentPostEntity } from './entities/comment-post.entity';
import { CreatePostUseCase, DeletePostUseCase } from './use-cases';
import { CreatePost, PostParam } from './use-cases/types';
type CommentPost = CreatePost & {
  postId: string;
};

type FindMany = {
  payload: JwtPayload;
  query: QueryParamDto;
};

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly imageStore: PostImageStoreUseCase,
    private readonly createPost: CreatePostUseCase,
    private readonly deletePost: DeletePostUseCase,
  ) {}

  async create({
    createPostDto,
    payload,
    images,
  }: CreatePost): Promise<PostEntity> {
    return this.createPost.execute({ createPostDto, payload, images });
  }

  async delete({ payload, postId }: PostParam): Promise<void> {
    return this.deletePost.execute({ postId, payload });
  }

  async findOne({ postId, payload }: PostParam): Promise<FindOnePostEntity> {
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
      parent: PostMapper.separeteParent(parent),
    };
  }

  async findMany({ payload, query }: FindMany): Promise<FindManyPostEntity> {
    const { search = '', limit = 50, offset = 0 } = query;

    const posts = await this.prisma.post.findMany({
      where: {
        text: {
          contains: search,
          mode: 'insensitive',
        },
        parentId: null,
      },
      select: {
        ...PostMapper.defautFields,
        ...PostMapper.likeFields(payload.id),
        ...PostMapper.countField,
      },
      take: limit,
      skip: offset,
    });

    const count = await this.prisma.post.count({
      where: {
        parentId: null,
      },
    });

    return {
      count,
      items: posts.map(({ _count, likes, ...post }) => {
        return { ...post, ...PostMapper.separate({ _count, likes }) };
      }),
    };
  }

  async comment({
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
