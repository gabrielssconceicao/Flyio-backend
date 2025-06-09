import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/prisma/prisma.service';
import { LikesService } from '../likes.service';
import { prismaServiceMock } from '@/prisma/prisma.service.mock';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('LikesService', () => {
  let service: LikesService;
  let prisma: ReturnType<typeof prismaServiceMock>;
  let payload: JwtPayload;
  let postId: string;
  beforeEach(async () => {
    prisma = prismaServiceMock();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LikesService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<LikesService>(LikesService);
    payload = { id: 'id-1' } as JwtPayload;
    postId = 'id-2';
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('LikePost', () => {
    it('should like a post', async () => {
      jest.spyOn(prisma.post, 'findUnique').mockResolvedValue({} as any);
      jest.spyOn(prisma.likePost, 'findUnique').mockResolvedValue(null);

      await service.likePost({ payload, postId });

      expect(prisma.post.findUnique).toHaveBeenCalledWith({
        where: { id: postId },
      });
      expect(prisma.likePost.findUnique).toHaveBeenCalledWith({
        where: { postId_userId: { postId, userId: payload.id } },
      });
      expect(prisma.likePost.create).toHaveBeenCalledWith({
        data: { postId, userId: payload.id },
      });
    });

    it('should throw NotFoundException if post not found', async () => {
      jest.spyOn(prisma.post, 'findUnique').mockResolvedValue(null);
      await expect(service.likePost({ payload, postId })).rejects.toThrow(
        NotFoundException,
      );
    });
    it('should throw BadRequestException if post already liked', async () => {
      jest.spyOn(prisma.post, 'findUnique').mockResolvedValue({} as any);
      jest.spyOn(prisma.likePost, 'findUnique').mockResolvedValue({} as any);
      await expect(service.likePost({ payload, postId })).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('DeslikePost', () => {
    it('should like a post', async () => {
      jest.spyOn(prisma.post, 'findUnique').mockResolvedValue({} as any);
      jest.spyOn(prisma.likePost, 'findUnique').mockResolvedValue({} as any);

      await service.deslikePost({ payload, postId });

      expect(prisma.post.findUnique).toHaveBeenCalledWith({
        where: { id: postId },
      });
      expect(prisma.likePost.findUnique).toHaveBeenCalledWith({
        where: { postId_userId: { postId, userId: payload.id } },
      });
      expect(prisma.likePost.delete).toHaveBeenCalledWith({
        where: { postId_userId: { userId: payload.id, postId } },
      });
    });

    it('should throw NotFoundException if post not found', async () => {
      jest.spyOn(prisma.post, 'findUnique').mockResolvedValue(null);
      await expect(service.likePost({ payload, postId })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if post already desliked', async () => {
      jest.spyOn(prisma.post, 'findUnique').mockResolvedValue({} as any);
      jest.spyOn(prisma.likePost, 'findUnique').mockResolvedValue(null);
      await expect(service.deslikePost({ payload, postId })).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
