import { PrismaService } from '@/prisma/prisma.service';
import { PostImageStoreUseCase } from '@/image-store/use-cases';
import { PostMapper } from '../post.mapper';
import { PostUseCase } from './post.use-case';
import { CreatePost } from './types';
import { PostEntity } from '../entities/post.entity';
import { ImageStoreTypeFolder } from '@/image-store/image-store.constants';

export class CreatePostUseCase extends PostUseCase {
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
