import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '@/prisma/prisma.service';
import { prismaServiceMock } from '@/prisma/prisma.service.mock';

import { UserImageStoreUseCase } from '@/image-store/use-cases';
import { HashingService } from '@/hash/hashing.service';
import { payloadMock } from '@/auth/mock/token-payload.mock';

import { currentUserMock } from '../mocks/current-user.mock';
import { MeMapper } from '../me.mapper';
import { GetMeUseCase } from '../use-cases';

describe('GetMeUseCase', () => {
  let useCase: GetMeUseCase;
  let prisma: ReturnType<typeof prismaServiceMock>;

  beforeEach(async () => {
    prisma = prismaServiceMock();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetMeUseCase,
        HashingService,
        UserImageStoreUseCase,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    useCase = module.get<GetMeUseCase>(GetMeUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
    expect(prisma).toBeDefined();
  });

  it('should get current user', async () => {
    const _count = { _count: { followers: 0, following: 0 } };
    jest
      .spyOn(prisma.user, 'findUnique')
      .mockResolvedValue({ ...currentUserMock(), ..._count } as any);

    const result = await useCase.execute(payloadMock);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: {
        id: payloadMock.id,
      },
      select: { ...MeMapper.defaultFields, ...MeMapper.followCountFields },
    });
    expect(result).toBeDefined();
    expect(result).toMatchSnapshot();
  });
});
