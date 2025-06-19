import { CreatePostUseCase } from './create-post.use-case';
import { DeletePostUseCase } from './delete-post.use-case';
import { FindOnePostUseCase } from './find-one-post.use-case';
import { FindManyPostUseCase } from './find-many-post.use-case';

export const PostUseCasesProviders = [
  CreatePostUseCase,
  DeletePostUseCase,
  FindManyPostUseCase,
  FindOnePostUseCase,
];
export {
  CreatePostUseCase,
  DeletePostUseCase,
  FindManyPostUseCase,
  FindOnePostUseCase,
};
