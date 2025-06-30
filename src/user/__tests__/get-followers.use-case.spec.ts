import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { prismaServiceMock } from '@/prisma/prisma.service.mock';
import { PrismaService } from '@/prisma/prisma.service';
import { PaginationDto } from '@/common/dto/pagination.dto';

import { searchUsersResponseMock } from '../mocks/';
import { GetFollowersUseCase } from '../use-cases';

describe('GetFollowersUseCase', () => {
  let useCase: GetFollowersUseCase;
  let prisma: ReturnType<typeof prismaServiceMock>;
  let paginationDtoMock: PaginationDto;
  beforeEach(async () => {
    prisma = prismaServiceMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetFollowersUseCase,

        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    useCase = module.get<GetFollowersUseCase>(GetFollowersUseCase);
    paginationDtoMock = { offset: 0, limit: 25 };
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
    expect(prisma).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get a user followers', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
      id: 'id-1',
    });

    jest.spyOn(prisma.follow, 'findMany').mockResolvedValue(
      searchUsersResponseMock().items.map((user) => {
        return { follower: user };
      }),
    );
    jest
      .spyOn(prisma.follow, 'count')
      .mockResolvedValue(searchUsersResponseMock().count);

    const result = await useCase.execute({
      username: 'username',
      query: paginationDtoMock,
    });
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { username: 'username' },
      select: { id: true },
    });
    expect(prisma.follow.findMany).toHaveBeenCalled();
    expect(prisma.follow.count).toHaveBeenCalledWith({
      where: { followingUserId: 'id-1' },
    });
    expect(result).toMatchSnapshot();
    expect(result.count).toEqual(searchUsersResponseMock().count);
    expect(result.items).toEqual(searchUsersResponseMock().items);
  });

  it('should throw a not found exception if user not found', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

    await expect(
      useCase.execute({
        username: 'username',
        query: paginationDtoMock,
      }),
    ).rejects.toThrow(NotFoundException);
  });
});
