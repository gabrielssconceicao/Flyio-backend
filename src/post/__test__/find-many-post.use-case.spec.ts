import { Test, TestingModule } from '@nestjs/testing';
import { PostImageStoreUseCase } from '@/image-store/use-cases';
import { postImageStoreUseCaseMock } from '@/image-store/mock';
import { prismaServiceMock } from '@/prisma/prisma.service.mock';
import { PrismaService } from '@/prisma/prisma.service';
import { _count, findManyPostMock } from '../mock';
import { FindManyPostUseCase } from '../use-cases';
import { payloadMock } from '@/auth/mock/token-payload.mock';

describe('FindManyPostUseCase', () => {
  let useCase: FindManyPostUseCase;
  let prisma: ReturnType<typeof prismaServiceMock>;

  beforeEach(async () => {
    prisma = prismaServiceMock();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindManyPostUseCase,
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

    useCase = module.get<FindManyPostUseCase>(FindManyPostUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
    expect(prisma).toBeDefined();
  });

  it('should return an array of post', async () => {
    jest.spyOn(prisma.post, 'findMany').mockResolvedValue(
      findManyPostMock().items.map((post) => ({
        ...post,
        ..._count,
      })),
    );
    jest
      .spyOn(prisma.post, 'count')
      .mockResolvedValue(findManyPostMock().count);

    const result = await useCase.execute({
      payload: payloadMock,
      query: {},
    });

    expect(prisma.post.findMany).toHaveBeenCalled();
    expect(prisma.post.count).toHaveBeenCalled();
    expect(result).toEqual(findManyPostMock());
    expect(result).toMatchSnapshot();
  });
});
