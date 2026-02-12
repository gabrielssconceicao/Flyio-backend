import { Either, left, right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Post } from '@/domain/social/enterprise/entities/post';
import { User } from '@/domain/social/enterprise/entities/user';

import { LikeRepository } from '../../repository/like-repository';
import { PostRepository } from '../../repository/post-repository';
import { UserRepository } from '../../repository/user-repository';

interface GetPostUseCaseRequest {
  viewerId: string;
  postId: string;
}

type GetPostUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    post: Post;
    author: User;
    isLiked: boolean;
  }
>;

export class GetPostUseCase {
  constructor(
    private postRepository: PostRepository,
    private userRepository: UserRepository,
    private likeRepository: LikeRepository,
  ) {}

  async execute({
    viewerId,
    postId,
  }: GetPostUseCaseRequest): Promise<GetPostUseCaseResponse> {
    const post = await this.postRepository.findById(new UniqueEntityId(postId));

    if (!post) {
      return left(new ResourceNotFoundError('Post'));
    }

    const author = await this.userRepository.findById(post.author_id);

    if (!author) {
      return left(new ResourceNotFoundError('Author'));
    }

    const isLiked = await this.likeRepository.isLiked({
      user_id: new UniqueEntityId(viewerId),
      post_id: post.id,
    });

    return right({
      author,
      post,
      isLiked,
    });
  }
}
