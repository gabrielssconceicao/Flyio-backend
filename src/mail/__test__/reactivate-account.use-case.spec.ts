import { Test, TestingModule } from '@nestjs/testing';

import { ReactivateAccountUseCase } from '../use-cases';
import { prismaServiceMock } from '@/prisma/prisma.service.mock';
import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('ReactivateAccountUseCase', () => {
  let useCase: ReactivateAccountUseCase;
  let prisma: ReturnType<typeof prismaServiceMock>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReactivateAccountUseCase,
        {
          provide: PrismaService,
          useValue: prismaServiceMock(),
        },
      ],
    }).compile();

    prisma = module.get<ReturnType<typeof prismaServiceMock>>(PrismaService);
    useCase = module.get<ReactivateAccountUseCase>(ReactivateAccountUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
    expect(prisma).toBeDefined();
  });

  it('should reactivate account', async () => {
    jest.spyOn(prisma.authLinks, 'findUnique').mockResolvedValue({
      id: 'id-1',
    });
    const result = await useCase.execute({ code: 'code' });
    expect(prisma.authLinks.findUnique).toHaveBeenCalled();
    expect(prisma.user.update).toHaveBeenCalled();
    expect(prisma.authLinks.deleteMany).toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it('should throw BadRequestException if code is invalid', async () => {
    jest.spyOn(prisma.authLinks, 'findUnique').mockResolvedValue(null);
    await expect(useCase.execute({ code: 'code' })).rejects.toThrow(
      BadRequestException,
    );
    expect(prisma.authLinks.findUnique).toHaveBeenCalled();
    expect(prisma.user.update).not.toHaveBeenCalled();
    expect(prisma.authLinks.deleteMany).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException if code is expired', async () => {
    jest.spyOn(prisma.authLinks, 'findUnique').mockResolvedValue({
      id: 'id-1',
      createdAt: new Date('2000-01-01'),
    });
    await expect(useCase.execute({ code: 'code' })).rejects.toThrow(
      BadRequestException,
    );
    expect(prisma.authLinks.findUnique).toHaveBeenCalled();
    expect(prisma.user.update).not.toHaveBeenCalled();
    expect(prisma.authLinks.deleteMany).not.toHaveBeenCalled();
  });
});
