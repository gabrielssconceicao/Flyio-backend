import { PostUseCase } from './post.use-case';
import { CreatePostUseCase } from './create-post.use-case';
import { DeletePostUseCase } from './delete-post.use-case';

export const PostUseCasesProviders = [
  PostUseCase,
  CreatePostUseCase,
  DeletePostUseCase,
];
export { PostUseCase, CreatePostUseCase, DeletePostUseCase };
