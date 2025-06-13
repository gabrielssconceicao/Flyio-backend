import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { ImageStoreModule } from '@/image-store/image-store.module';

@Module({
  imports: [ImageStoreModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
