import { Module } from '@nestjs/common';
import { PostImageStoreUseCase, UserImageStoreUseCase } from './use-cases';

@Module({
  controllers: [],
  providers: [PostImageStoreUseCase, UserImageStoreUseCase],
  exports: [PostImageStoreUseCase, UserImageStoreUseCase],
})
export class ImageStoreModule {}
