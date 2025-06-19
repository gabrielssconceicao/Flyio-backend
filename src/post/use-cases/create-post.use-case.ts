import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { PostImageStoreUseCase } from '@/image-store/use-cases';
import { ImageStoreTypeFolder } from '@/image-store/image-store.constants';
import { UseCase } from '@/common/utils/use-case';
import { PostMapper } from '../post.mapper';
import { CreatePost } from './types';
import { PostEntity } from '../entities/post.entity';

@Injectable()
export class CreatePostUseCase extends UseCase<CreatePost, PostEntity> {
  constructor(
    protected readonly prisma: PrismaService,
    private readonly imageStore: PostImageStoreUseCase,
  ) {
    super(prisma);
  }

  async execute({
    createPostDto,
    payload,
    images,
  }: CreatePost): Promise<PostEntity> {
    let imagesUrl: string[] = [];

    if (images.length) {
      imagesUrl = await this.imageStore.uploadPostImages({
        files: images,
        folder: ImageStoreTypeFolder.POST,
      });
    }

    const post = await this.prisma.post.create({
      data: {
        text: createPostDto.content,
        authorId: payload.id,
        images: {
          createMany: {
            data: imagesUrl.map((url) => ({ url })),
          },
        },
      },
      select: PostMapper.defautFields,
    });

    return { ...post, likes: 0, replies: 0, isLiked: false };
  }
}
