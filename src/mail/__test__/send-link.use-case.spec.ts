import { Test, TestingModule } from '@nestjs/testing';

import { SendLinkUseCase } from '../use-cases';
import { prismaServiceMock } from '@/prisma/prisma.service.mock';
import { PrismaService } from '@/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('ReactivateAccountUseCase', () => {
  let useCase: SendLinkUseCase;
  let prisma: ReturnType<typeof prismaServiceMock>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SendLinkUseCase,
        {
          provide: PrismaService,
          useValue: prismaServiceMock(),
        },
      ],
    }).compile();

    prisma = module.get<ReturnType<typeof prismaServiceMock>>(PrismaService);
    useCase = module.get<SendLinkUseCase>(SendLinkUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
    expect(prisma).toBeDefined();
  });

  it('should return authLink Id', async () => {
    jest
      .spyOn(prisma.user, 'findUnique')
      .mockResolvedValue({ id: 'id-1' } as any);
    jest
      .spyOn(prisma.authLinks, 'create')
      .mockResolvedValue({ id: 'auth-link-id-1' } as any);

    const result = await useCase.execute({ email: 'email' });
    expect(prisma.user.findUnique).toHaveBeenCalled();
    expect(prisma.authLinks.create).toHaveBeenCalled();
    expect(result).toEqual({ authLinkId: 'auth-link-id-1' });
    expect(result).toMatchSnapshot();
  });

  it('should throw NotFoundException if email not found', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
    await expect(useCase.execute({ email: 'email' })).rejects.toThrow(
      NotFoundException,
    );
    expect(prisma.user.findUnique).toHaveBeenCalled();
    expect(prisma.authLinks.create).not.toHaveBeenCalled();
  });
});
