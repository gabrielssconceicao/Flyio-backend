import { Test, TestingModule } from '@nestjs/testing';
import { FollowService } from '../follow.service';
import { prismaServiceMock } from '@/prisma/prisma.service.mock';
import { PrismaService } from '@/prisma/prisma.service';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { BadRequestException, NotFoundException } from '@nestjs/common';
describe('FollowService', () => {
  let service: FollowService;
  let prisma: ReturnType<typeof prismaServiceMock>;
  let payload: JwtPayload;
  beforeEach(async () => {
    prisma = prismaServiceMock();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FollowService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<FollowService>(FollowService);
    payload = { id: 'id-1' } as JwtPayload;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
  });

  describe('Follow', () => {
    it('should follow a user', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({} as any);

      jest.spyOn(prisma.follow, 'findUnique').mockResolvedValue(null);

      await service.follow({ followingUserId: 'id-33', payload });

      expect(prisma.user.findUnique).toHaveBeenCalled();
      expect(prisma.follow.findUnique).toHaveBeenCalled();
      expect(prisma.follow.create).toHaveBeenCalled();
    });

    it('should thow an BadRequestException if followingUserId is the same as followedBy', async () => {
      await expect(
        service.follow({ followingUserId: 'id-1', payload }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should thow an NotFoundException if followingUserId is not found', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
      await expect(
        service.follow({ followingUserId: 'id-33', payload }),
      ).rejects.toThrow(NotFoundException);
      expect(prisma.user.findUnique).toHaveBeenCalled();
    });

    it('should thow an BadRequestException if you are already following this user', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({} as any);

      jest.spyOn(prisma.follow, 'findUnique').mockResolvedValue({} as any);

      await expect(
        service.follow({ followingUserId: 'id-33', payload }),
      ).rejects.toThrow(BadRequestException);

      expect(prisma.user.findUnique).toHaveBeenCalled();
      expect(prisma.follow.findUnique).toHaveBeenCalled();
    });
  });

  describe('Unfollow', () => {
    it('should unfollow a user', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({} as any);

      jest.spyOn(prisma.follow, 'findUnique').mockResolvedValue({} as any);

      await service.unfollow({ followingUserId: 'id-33', payload });

      expect(prisma.user.findUnique).toHaveBeenCalled();
      expect(prisma.follow.findUnique).toHaveBeenCalled();
      expect(prisma.follow.delete).toHaveBeenCalled();
    });

    it('should thow an BadRequestException if followingUserId is the same as followedBy', async () => {
      await expect(
        service.unfollow({ followingUserId: 'id-1', payload }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should thow an NotFoundException if followingUserId is not found', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
      await expect(
        service.unfollow({ followingUserId: 'id-33', payload }),
      ).rejects.toThrow(NotFoundException);
      expect(prisma.user.findUnique).toHaveBeenCalled();
    });

    it('should thow an BadRequestException if you already unfollow this user', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({} as any);

      jest.spyOn(prisma.follow, 'findUnique').mockResolvedValue(null);

      await expect(
        service.unfollow({ followingUserId: 'id-33', payload }),
      ).rejects.toThrow(BadRequestException);

      expect(prisma.user.findUnique).toHaveBeenCalled();
      expect(prisma.follow.findUnique).toHaveBeenCalled();
    });
  });
});
