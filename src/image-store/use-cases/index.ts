import { ImageStoreUseCase } from './image-store.use-case';
import { PostImageStoreUseCase } from './post-image-store.use-case';
import { UserImageStoreUseCase } from './user-image-store.use-case';
export const ImageStoreUseCasesProviders = [
  ImageStoreUseCase,
  PostImageStoreUseCase,
  UserImageStoreUseCase,
];
export { PostImageStoreUseCase, UserImageStoreUseCase };
