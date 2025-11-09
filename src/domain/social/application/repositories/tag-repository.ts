import { Tag } from '../../enterprise/entities/tag';

export abstract class TagRepository {
  abstract findManyByNames(tags: string[]): Promise<Tag[]>;
  abstract create(tag: Tag): Promise<void>;
}
