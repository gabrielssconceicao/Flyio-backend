import { Either, right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Post } from '@/domain/social/enterprise/entities/post';
import { PostTag } from '@/domain/social/enterprise/entities/post-tag';
import { Tag } from '@/domain/social/enterprise/entities/tag';

import {
  PostResponse,
  PostsRepository,
} from '../../repositories/posts-repository';
import { TagRepository as TagsRepository } from '../../repositories/tag-repository';

interface CreatePostRequest {
  authorId: string;
  content: string;
  tagNames: string[];
}

type CreatePostResponse = Either<null, PostResponse>;

export class CreatePostUseCase {
  constructor(
    private postRepository: PostsRepository,
    private tagReposotiory: TagsRepository,
  ) {}

  async execute({
    authorId,
    content,
    tagNames,
  }: CreatePostRequest): Promise<CreatePostResponse> {
    // get existing tags
    const existingTags = await this.tagReposotiory.findManyByNames(tagNames);
    const existingTagNames = existingTags.map((tag) => tag.name);

    // filter new tags from existing tags
    const newTags = tagNames
      .filter((tag) => !existingTagNames.includes(tag))
      .map((tag) =>
        Tag.create({
          name: tag,
        }),
      );

    // create new tags
    for (const tag of newTags) {
      await this.tagReposotiory.create(tag);
    }
    // add new tags to existing tags
    const allTags = [...existingTags, ...newTags];
    const post = Post.create({
      author_id: new UniqueEntityId(authorId),
      content: content,
    });

    // create relation
    const postTags = allTags.map((tag) =>
      PostTag.create({
        postId: post.id,
        tagId: tag.id,
      }),
    );
    post.tags = postTags;

    const { author, tags, isLiked } = await this.postRepository.create(post);

    return right({ post, author, tags, isLiked });
  }
}
