import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { payloadMock } from '@/auth/mock/token-payload.mock';
import { PostImageStoreUseCase } from '@/image-store/use-cases';
import { postImageStoreUseCaseMock } from '@/image-store/mock';
import { prismaServiceMock } from '@/prisma/prisma.service.mock';
import { PrismaService } from '@/prisma/prisma.service';
import { postMock } from '../mock';
import { DeletePostUseCase } from '../use-cases';

describe('DeletePostUseCase', () => {
  let useCase: DeletePostUseCase;
  let imageStore: PostImageStoreUseCase;
  let prisma: ReturnType<typeof prismaServiceMock>;

  beforeEach(async () => {
    prisma = prismaServiceMock();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeletePostUseCase,
        {
          provide: PrismaService,
          useValue: prisma,
        },

        {
          provide: PostImageStoreUseCase,
          useValue: postImageStoreUseCaseMock(),
        },
      ],
    }).compile();

    useCase = module.get<DeletePostUseCase>(DeletePostUseCase);
    imageStore = module.get<PostImageStoreUseCase>(PostImageStoreUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
    expect(imageStore).toBeDefined();
    expect(prisma).toBeDefined();
  });

  it('should delete a post', async () => {
    jest.spyOn(prisma.post, 'findUnique').mockResolvedValue(postMock());
    jest.spyOn(imageStore, 'deletePostImages').mockImplementation();
    await useCase.execute({ postId: postMock().id, payload: payloadMock });
    expect(prisma.post.findUnique).toHaveBeenCalled();
    expect(imageStore.deletePostImages).toHaveBeenCalled();
    expect(prisma.post.delete).toHaveBeenCalled();
  });

  it('should throw a not found exception if post not found', async () => {
    jest.spyOn(prisma.post, 'findUnique').mockResolvedValue(null);
    await expect(
      useCase.execute({ postId: postMock().id, payload: payloadMock }),
    ).rejects.toThrow(NotFoundException);
  });
});
