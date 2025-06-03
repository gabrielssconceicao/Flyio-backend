import { Module } from '@nestjs/common';
import { ImageStoreService } from './image-store.service';

@Module({
  controllers: [],
  providers: [ImageStoreService],
})
export class ImageStoreModule {}
