import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '@/prisma/prisma.service';
import { prismaServiceMock } from '@/prisma/prisma.service.mock';

import { UserImageStoreUseCase } from '@/image-store/use-cases';
import { HashingService } from '@/hash/hashing.service';
import { payloadMock } from '@/auth/mock/token-payload.mock';

import { DesactivateMeUserCase } from '../use-cases';

describe('DesactivateMeUseCase', () => {
  let useCase: DesactivateMeUserCase;
  let prisma: ReturnType<typeof prismaServiceMock>;

  beforeEach(async () => {
    prisma = prismaServiceMock();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DesactivateMeUserCase,
        HashingService,
        UserImageStoreUseCase,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    useCase = module.get<DesactivateMeUserCase>(DesactivateMeUserCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
    expect(prisma).toBeDefined();
  });

  it('should desactivate current user', async () => {
    await useCase.execute({ id: payloadMock.id });
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: {
        id: payloadMock.id,
      },
      data: {
        isActive: false,
      },
    });
  });
});
