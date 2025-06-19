import { CreatePostUseCase } from './create-post.use-case';
import { DeletePostUseCase } from './delete-post.use-case';

export const PostUseCasesProviders = [CreatePostUseCase, DeletePostUseCase];
export { CreatePostUseCase, DeletePostUseCase };
