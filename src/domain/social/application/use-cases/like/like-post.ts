import { Either, left, right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Like } from '@/domain/social/enterprise/entities/like';

import { LikeRepository } from '../../repository/like-repository';
import { PostRepository } from '../../repository/post-repository';

interface LikePostUseCaseRequest {
  postId: string;
  userId: string;
}

type LikePostUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;

export class LikePostUseCase {
  constructor(
    private postRepository: PostRepository,
    private likeRepository: LikeRepository,
  ) {}

  async execute({
    postId,
    userId,
  }: LikePostUseCaseRequest): Promise<LikePostUseCaseResponse> {
    const user_id = new UniqueEntityId(userId);
    const post = await this.postRepository.findById(new UniqueEntityId(postId));

    if (!post) {
      return left(new ResourceNotFoundError('Post'));
    }

    const isLiked = await this.likeRepository.isLiked({
      user_id,
      post_id: post.id,
    });

    if (isLiked) {
      return left(new NotAllowedError());
    }

    const like = Like.create({
      post_id: post.id,
      user_id,
    });

    post.like();

    await Promise.all([
      this.postRepository.save(post),
      this.likeRepository.create(like),
    ]);

    return right(null);
  }
}
