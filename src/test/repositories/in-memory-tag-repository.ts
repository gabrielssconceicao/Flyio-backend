import { TagRepository } from '@/domain/social/application/repositories/tag-repository';
import { Tag } from '@/domain/social/enterprise/entities/tag';

export class InMemoryTagRepository extends TagRepository {
  items: Tag[] = [];

  async create(tag: Tag) {
    this.items.push(tag);
  }

  async findManyByNames(tags: string[]) {
    const tagsFound = this.items.filter((tag) => tags.includes(tag.name));

    return tagsFound;
  }
}
