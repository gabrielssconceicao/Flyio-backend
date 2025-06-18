import { Module } from '@nestjs/common';
import {
  ImageStoreUseCasesProviders,
  PostImageStoreUseCase,
  UserImageStoreUseCase,
} from './use-cases';

@Module({
  controllers: [],
  providers: [...ImageStoreUseCasesProviders],
  exports: [PostImageStoreUseCase, UserImageStoreUseCase],
})
export class ImageStoreModule {}
