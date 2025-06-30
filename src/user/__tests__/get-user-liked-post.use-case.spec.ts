import { Test, TestingModule } from '@nestjs/testing';

import { prismaServiceMock } from '@/prisma/prisma.service.mock';
import { PrismaService } from '@/prisma/prisma.service';
import { PaginationDto } from '@/common/dto/pagination.dto';

import { GetUserLikedPostUseCase } from '../use-cases';
import { getLikesMock } from '../mocks';
import { payloadMock } from '@/auth/mock/token-payload.mock';

describe('GetUserLikedPostUseCase', () => {
  let useCase: GetUserLikedPostUseCase;
  let prisma: ReturnType<typeof prismaServiceMock>;
  let paginationDtoMock: PaginationDto;
  beforeEach(async () => {
    prisma = prismaServiceMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUserLikedPostUseCase,

        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    useCase = module.get<GetUserLikedPostUseCase>(GetUserLikedPostUseCase);
    paginationDtoMock = { offset: 0, limit: 25 };
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
    expect(prisma).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get a user liked posts', async () => {
    jest.spyOn(prisma.likePost, 'findMany').mockResolvedValue(
      getLikesMock().items.map((item) => ({
        post: {
          ...item,
          _count: { replies: 0, likes: 0 },
          likes: [],
        },
      })),
    );
    jest
      .spyOn(prisma.likePost, 'count')
      .mockResolvedValue(getLikesMock().count);
    const result = await useCase.execute({
      username: 'username',
      query: paginationDtoMock,
      payload: payloadMock,
    });
    expect(prisma.likePost.findMany).toHaveBeenCalled();
    expect(prisma.likePost.count).toHaveBeenCalled();
    expect(result.count).toEqual(getLikesMock().count);
    expect(result.items).toEqual(getLikesMock().items);
    expect(result).toMatchSnapshot();
  });
});
