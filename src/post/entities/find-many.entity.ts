import { createFindManyDto } from '@/common/dto/find-many.dto';
import { PostEntity } from './post.entity';

export class FindManyPostEntity extends createFindManyDto(PostEntity) {}
