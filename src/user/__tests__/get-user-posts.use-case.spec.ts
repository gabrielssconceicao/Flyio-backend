import { Test, TestingModule } from '@nestjs/testing';

import { prismaServiceMock } from '@/prisma/prisma.service.mock';
import { PrismaService } from '@/prisma/prisma.service';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { payloadMock } from '@/auth/mock/token-payload.mock';
import { findManyPostMock } from '@/post/mock';

import { GetUserPostsUseCase } from '../use-cases';

describe('GetUserPosts UseCase', () => {
  let useCase: GetUserPostsUseCase;
  let prisma: ReturnType<typeof prismaServiceMock>;
  let paginationDtoMock: PaginationDto;
  beforeEach(async () => {
    prisma = prismaServiceMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUserPostsUseCase,

        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    useCase = module.get<GetUserPostsUseCase>(GetUserPostsUseCase);
    paginationDtoMock = { offset: 0, limit: 25 };
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
    expect(prisma).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an array of post', async () => {
    jest.spyOn(prisma.post, 'findMany').mockResolvedValue(
      findManyPostMock().items.map((post) => ({
        ...post,
        ...{ _count: { replies: 0, likes: 0 } },
        parent: { author: { username: 'johndoe' } },
      })),
    );
    jest
      .spyOn(prisma.post, 'count')
      .mockResolvedValue(findManyPostMock().count);

    const result = await useCase.execute({
      username: 'username',
      query: paginationDtoMock,
      payload: payloadMock,
    });

    expect(prisma.post.findMany).toHaveBeenCalled();
    expect(prisma.post.count).toHaveBeenCalled();
    expect(result).toEqual({
      count: findManyPostMock().count,
      items: findManyPostMock().items.map((post) => ({
        ...post,
        parent: { author: { username: 'johndoe' } },
      })),
    });
    expect(result).toMatchSnapshot();
  });
});
