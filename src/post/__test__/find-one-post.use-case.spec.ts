import { Test, TestingModule } from '@nestjs/testing';
import { PostImageStoreUseCase } from '@/image-store/use-cases';
import { postImageStoreUseCaseMock } from '@/image-store/mock';
import { prismaServiceMock } from '@/prisma/prisma.service.mock';
import { PrismaService } from '@/prisma/prisma.service';
import { _count, postMock } from '../mock';
import { FindOnePostUseCase } from '../use-cases';
import { NotFoundException } from '@nestjs/common';
import { payloadMock } from '@/auth/mock/token-payload.mock';

describe('FindOnePostUseCase', () => {
  let useCase: FindOnePostUseCase;
  let imageStore: PostImageStoreUseCase;
  let prisma: ReturnType<typeof prismaServiceMock>;

  beforeEach(async () => {
    prisma = prismaServiceMock();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindOnePostUseCase,
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

    useCase = module.get<FindOnePostUseCase>(FindOnePostUseCase);
    imageStore = module.get(PostImageStoreUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
    expect(imageStore).toBeDefined();
    expect(prisma).toBeDefined();
  });

  it('should return a post', async () => {
    jest.spyOn(prisma.post, 'findUnique').mockResolvedValue({
      ...postMock(),
      ..._count,
      replies: [],
      parent: null,
    });

    const result = await useCase.execute({
      postId: postMock().id,
      payload: payloadMock,
    });

    expect(prisma.post.findUnique).toHaveBeenCalled();
    expect(result).toMatchSnapshot();
  });

  it('should throw a not found exception if post not found', async () => {
    jest.spyOn(prisma.post, 'findUnique').mockResolvedValue(null);
    await expect(
      useCase.execute({
        postId: postMock().id,
        payload: payloadMock,
      }),
    ).rejects.toThrow(NotFoundException);
  });
});
