import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { prismaServiceMock } from '@/prisma/prisma.service.mock';

import { HashingService } from '@/hash/hashing.service';
import { payloadMock } from '@/auth/mock/token-payload.mock';
import { UserImageStoreUseCase } from '@/image-store/use-cases';
import {
  profilePictureMock,
  userImageStoreUseCaseMock,
} from '@/image-store/mock';
import { ImageStoreTypeFolder } from '@/image-store/image-store.constants';

import { DeleteBannerImageUseCase } from '../use-cases';

describe('DeleteBannerImageUseCase', () => {
  let useCase: DeleteBannerImageUseCase;
  let prisma: ReturnType<typeof prismaServiceMock>;
  let imageStore: UserImageStoreUseCase;

  beforeEach(async () => {
    prisma = prismaServiceMock();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteBannerImageUseCase,
        HashingService,
        {
          provide: UserImageStoreUseCase,
          useValue: userImageStoreUseCaseMock(),
        },
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    useCase = module.get<DeleteBannerImageUseCase>(DeleteBannerImageUseCase);
    imageStore = module.get<UserImageStoreUseCase>(UserImageStoreUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
    expect(prisma).toBeDefined();
    expect(imageStore).toBeDefined();
  });

  it('should delete profile image', async () => {
    jest
      .spyOn(prisma.user, 'findUnique')
      .mockResolvedValue({ bannerImg: profilePictureMock });
    jest
      .spyOn(imageStore, 'deleteUserImage')
      .mockResolvedValue({ result: 'ok' });
    await useCase.execute({ id: payloadMock.id });
    expect(imageStore.deleteUserImage).toHaveBeenCalledWith({
      fileUrl: profilePictureMock,
      folder: ImageStoreTypeFolder.BANNER,
    });
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: {
        id: payloadMock.id,
      },
      select: { bannerImg: true },
    });
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: {
        id: payloadMock.id,
      },
      data: {
        bannerImg: null,
      },
    });
  });
  it('should thow an BadRequestException', async () => {
    jest
      .spyOn(prisma.user, 'findUnique')
      .mockResolvedValue({ bannerImg: profilePictureMock });
    jest
      .spyOn(imageStore, 'deleteUserImage')
      .mockResolvedValue({ result: 'not_found' });
    await expect(useCase.execute({ id: payloadMock.id })).rejects.toThrow(
      BadRequestException,
    );
    expect(imageStore.deleteUserImage).toHaveBeenCalledWith({
      fileUrl: profilePictureMock,
      folder: ImageStoreTypeFolder.BANNER,
    });
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: {
        id: payloadMock.id,
      },
      select: { bannerImg: true },
    });
  });
});
