import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { PostImageStoreUseCase } from '@/image-store/use-cases';
import { ImageStoreTypeFolder } from '@/image-store/image-store.constants';
import { PostMapper } from './post.mapper';
import { PostEntity } from './entities/post.entity';
import { FindManyPostEntity } from './entities/find-many.entity';
import { FindOnePostEntity } from './entities/find-one-post.entity';
import { CommentPostEntity } from './entities/comment-post.entity';
import {
  CreatePostUseCase,
  DeletePostUseCase,
  FindOnePostUseCase,
  FindManyPostUseCase,
} from './use-cases';
import { CreatePost, FindMany, PostParam } from './use-cases/types';
type CommentPost = CreatePost & {
  postId: string;
};

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly imageStore: PostImageStoreUseCase,
    private readonly createPost: CreatePostUseCase,
    private readonly deletePost: DeletePostUseCase,
    private readonly findOnePost: FindOnePostUseCase,
    private readonly findManyPost: FindManyPostUseCase,
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
    return this.findOnePost.execute({ postId, payload });
  }

  async findMany({ payload, query }: FindMany): Promise<FindManyPostEntity> {
    return this.findManyPost.execute({ payload, query });
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
