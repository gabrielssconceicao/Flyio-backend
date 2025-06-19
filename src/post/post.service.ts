import { Injectable } from '@nestjs/common';
import { PostEntity } from './entities/post.entity';
import {
  CommentPostEntity,
  FindManyPostEntity,
  FindOnePostEntity,
} from './entities';
import {
  CreatePostUseCase,
  DeletePostUseCase,
  FindOnePostUseCase,
  FindManyPostUseCase,
  ReplyPostUseCase,
} from './use-cases';
import {
  CommentPost,
  CreatePost,
  FindMany,
  PostParam,
} from './use-cases/types';

@Injectable()
export class PostService {
  constructor(
    private readonly createPost: CreatePostUseCase,
    private readonly deletePost: DeletePostUseCase,
    private readonly findOnePost: FindOnePostUseCase,
    private readonly findManyPost: FindManyPostUseCase,
    private readonly replyPost: ReplyPostUseCase,
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

  async reply({
    createPostDto,
    images,
    payload,
    postId,
  }: CommentPost): Promise<CommentPostEntity> {
    return this.replyPost.execute({ createPostDto, images, payload, postId });
  }
}
