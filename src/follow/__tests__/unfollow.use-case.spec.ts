import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { prismaServiceMock } from '@/prisma/prisma.service.mock';
import { PrismaService } from '@/prisma/prisma.service';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { UnfollowUseCase } from '../use-cases';

describe('FollowUseService', () => {
  let useCase: UnfollowUseCase;
  let prisma: ReturnType<typeof prismaServiceMock>;
  let payload: JwtPayload;
  let username: string;
  beforeEach(async () => {
    prisma = prismaServiceMock();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UnfollowUseCase,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    useCase = module.get<UnfollowUseCase>(UnfollowUseCase);
    payload = { id: 'id-1', username: 'johndoe2' } as JwtPayload;
    username = 'jonhdoe';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
    expect(prisma).toBeDefined();
  });

  it('should unfollow a user', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({} as any);

    jest.spyOn(prisma.follow, 'findUnique').mockResolvedValue({} as any);

    await useCase.execute({ username, payload });

    expect(prisma.user.findUnique).toHaveBeenCalled();
    expect(prisma.follow.findUnique).toHaveBeenCalled();
    expect(prisma.follow.delete).toHaveBeenCalled();
  });

  it('should thow an BadRequestException if followingUserId is the same as followedBy', async () => {
    username = payload.username;
    await expect(useCase.execute({ username, payload })).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should thow an NotFoundException if followingUserId is not found', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
    await expect(useCase.execute({ username, payload })).rejects.toThrow(
      NotFoundException,
    );
    expect(prisma.user.findUnique).toHaveBeenCalled();
  });

  it('should thow an BadRequestException if you already unfollow this user', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({} as any);

    jest.spyOn(prisma.follow, 'findUnique').mockResolvedValue(null);

    await expect(useCase.execute({ username, payload })).rejects.toThrow(
      BadRequestException,
    );

    expect(prisma.user.findUnique).toHaveBeenCalled();
    expect(prisma.follow.findUnique).toHaveBeenCalled();
  });
});
