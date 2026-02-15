import { Either, left, right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { PostAlreadyDislikedError } from '@/core/errors/like/post-already-disliked-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Like } from '@/domain/social/enterprise/entities/like';

import { LikeRepository } from '../../repository/like-repository';
import { PostRepository } from '../../repository/post-repository';

interface DislikePostUseCaseRequest {
  postId: string;
  userId: string;
}

type DislikePostUseCaseResponse = Either<
  ResourceNotFoundError | PostAlreadyDislikedError,
  null
>;

export class DislikePostUseCase {
  constructor(
    private postRepository: PostRepository,
    private likeRepository: LikeRepository,
  ) {}

  async execute({
    postId,
    userId,
  }: DislikePostUseCaseRequest): Promise<DislikePostUseCaseResponse> {
    const user_id = new UniqueEntityId(userId);
    const post = await this.postRepository.findById(new UniqueEntityId(postId));

    if (!post) {
      return left(new ResourceNotFoundError('Post'));
    }

    const isLiked = await this.likeRepository.isLiked({
      user_id,
      post_id: post.id,
    });

    if (!isLiked) {
      return left(new PostAlreadyDislikedError());
    }

    const like = Like.create({
      post_id: post.id,
      user_id,
    });

    post.dislike();

    await Promise.all([
      this.postRepository.save(post),
      this.likeRepository.delete(like),
    ]);

    return right(null);
  }
}
