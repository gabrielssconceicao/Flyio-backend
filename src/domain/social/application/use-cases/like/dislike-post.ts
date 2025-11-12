import { Either, left, right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ActionNotAllowedError } from '@/core/errors/action-not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Like } from '@/domain/social/enterprise/entities/like';

import { LikeRepository } from '../../repositories/like-repository';
import { PostsRepository } from '../../repositories/posts-repository';

interface DislikeUseCaseRequest {
  postId: string;
  userId: string;
}

type DislikeUseCaseResponse = Either<
  ResourceNotFoundError | ActionNotAllowedError,
  null
>;

export class DislikeUseCase {
  constructor(
    private postRepository: PostsRepository,
    private likeRepository: LikeRepository,
  ) {}

  async execute({
    postId,
    userId,
  }: DislikeUseCaseRequest): Promise<DislikeUseCaseResponse> {
    const post = await this.postRepository.findById(postId);

    if (!post) {
      return left(new ResourceNotFoundError());
    }

    const existingLike = await this.likeRepository.findByUserAndPostId({
      postId,
      userId,
    });

    if (!existingLike) {
      return left(new ActionNotAllowedError());
    }

    const like = Like.create({
      post_id: post.id,
      user_id: new UniqueEntityId(userId),
    });

    await this.likeRepository.delete(like);
    post.removeLike();
    await this.postRepository.save(post);

    return right(null);
  }
}
