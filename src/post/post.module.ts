import { Module } from '@nestjs/common';
import { ImageStoreModule } from '@/image-store/image-store.module';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PostUseCasesProviders } from './use-cases';

@Module({
  imports: [ImageStoreModule],
  controllers: [PostController],
  providers: [...PostUseCasesProviders, PostService],
})
export class PostModule {}
