import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
  PostTag,
  PostTagProps,
} from '@/domain/social/enterprise/entities/post-tag';
export function makePostTag(
  override: Partial<PostTagProps> = {},
  id?: UniqueEntityId,
) {
  const newTag = PostTag.create(
    {
      postId: new UniqueEntityId(),
      tagId: new UniqueEntityId(),
      ...override,
    },
    id,
  );

  return newTag;
}
