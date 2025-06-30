import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { prismaServiceMock } from '@/prisma/prisma.service.mock';
import { payloadMock } from '@/auth/mock/token-payload.mock';
import { DislikePostUseCase } from '../use-cases';
import { Like } from '../use-cases/type';

describe('DislikePostUseCase', () => {
  let useCase: DislikePostUseCase;
  let prisma: ReturnType<typeof prismaServiceMock>;
  let body: Like;
  let postId: string;
  beforeEach(async () => {
    prisma = prismaServiceMock();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DislikePostUseCase,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    useCase = module.get<DislikePostUseCase>(DislikePostUseCase);
    postId = 'id-1';
    body = { payload: payloadMock, postId };
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should deslike a post', async () => {
    jest.spyOn(prisma.post, 'findUnique').mockResolvedValue({} as any);
    jest.spyOn(prisma.likePost, 'findUnique').mockResolvedValue({} as any);

    await useCase.execute(body);

    expect(prisma.post.findUnique).toHaveBeenCalledWith({
      where: { id: postId },
    });
    expect(prisma.likePost.findUnique).toHaveBeenCalledWith({
      where: { postId_userId: { postId, userId: payloadMock.id } },
    });
    expect(prisma.likePost.delete).toHaveBeenCalledWith({
      where: { postId_userId: { userId: payloadMock.id, postId } },
    });
  });

  it('should throw NotFoundException if post not found', async () => {
    jest.spyOn(prisma.post, 'findUnique').mockResolvedValue(null);
    await expect(useCase.execute(body)).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException if post already desliked', async () => {
    jest.spyOn(prisma.post, 'findUnique').mockResolvedValue({} as any);
    jest.spyOn(prisma.likePost, 'findUnique').mockResolvedValue(null);
    await expect(useCase.execute(body)).rejects.toThrow(BadRequestException);
  });
});
