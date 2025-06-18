import { Test, TestingModule } from '@nestjs/testing';

import { prismaServiceMock } from '@/prisma/prisma.service.mock';
import { PrismaService } from '@/prisma/prisma.service';

import { searchUsersResponseMock } from '../mocks/search-users-response.mock';
import { SearchUserUseCase } from '../use-cases';

describe('SerchUserUseCase', () => {
  let useCase: SearchUserUseCase;
  let prisma: ReturnType<typeof prismaServiceMock>;

  beforeEach(async () => {
    prisma = prismaServiceMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchUserUseCase,

        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    useCase = module.get<SearchUserUseCase>(SearchUserUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
    expect(prisma).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find users by name or username', async () => {
    jest
      .spyOn(prisma.user, 'findMany')
      .mockResolvedValue(searchUsersResponseMock().items);

    jest
      .spyOn(prisma.user, 'count')
      .mockResolvedValue(searchUsersResponseMock().count);
    const result = await useCase.execute({
      search: 'johndoe',
      limit: 10,
      offset: 0,
    });
    expect(prisma.user.count).toHaveBeenCalled();
    expect(prisma.user.findMany).toHaveBeenCalled();
    expect(result).toMatchSnapshot();
  });
});
