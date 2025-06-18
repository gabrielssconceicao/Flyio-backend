import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { prismaServiceMock } from '@/prisma/prisma.service.mock';
import { PrismaService } from '@/prisma/prisma.service';

import { UserMapper } from '../user.mapper';
import { userMock } from '../mocks/user.mock';
import { GetUserUseCase } from '../use-cases/get-user.use-case';

describe('GetUserUseCase', () => {
  let useCase: GetUserUseCase;
  let prisma: ReturnType<typeof prismaServiceMock>;

  beforeEach(async () => {
    prisma = prismaServiceMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUserUseCase,

        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    useCase = module.get<GetUserUseCase>(GetUserUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
    expect(prisma).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find a user', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
      ...userMock(),
      _count: { followers: 0, following: 0 },
    } as any);

    const result = await useCase.execute({ username: 'jonhdoe' });

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { username: 'jonhdoe' },
      select: UserMapper.findUserFields,
    });

    expect(result.user).toEqual(userMock());
    expect(result).toMatchSnapshot();
  });

  it('should throw a not found exception if user not found', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

    await expect(useCase.execute({ username: 'username' })).rejects.toThrow(
      NotFoundException,
    );
  });
});
