import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { prismaServiceMock } from '@/prisma/prisma.service.mock';

import { payloadMock } from '@/auth/mock/token-payload.mock';
import { HashingService } from '@/hash/hashing.service';

import { UserImageStoreUseCase } from '@/image-store/use-cases';
import {
  profilePictureMock,
  userImageStoreUseCaseMock,
} from '@/image-store/mock';
import { ImageStoreTypeFolder } from '@/image-store/image-store.constants';

import { DeleteProfileImageUseCase } from '../use-cases';

describe('DeleteProfileImageUseCase', () => {
  let useCase: DeleteProfileImageUseCase;
  let prisma: ReturnType<typeof prismaServiceMock>;
  let imageStore: UserImageStoreUseCase;

  beforeEach(async () => {
    prisma = prismaServiceMock();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteProfileImageUseCase,
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

    useCase = module.get<DeleteProfileImageUseCase>(DeleteProfileImageUseCase);
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
      .mockResolvedValue({ profileImg: profilePictureMock });
    jest
      .spyOn(imageStore, 'deleteUserImage')
      .mockResolvedValue({ result: 'ok' });
    await useCase.execute({ id: payloadMock.id });
    expect(imageStore.deleteUserImage).toHaveBeenCalledWith({
      fileUrl: profilePictureMock,
      folder: ImageStoreTypeFolder.PROFILE,
    });
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: {
        id: payloadMock.id,
      },
      select: { profileImg: true },
    });
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: {
        id: payloadMock.id,
      },
      data: {
        profileImg: null,
      },
    });
  });
  it('should thow an BadRequestException', async () => {
    jest
      .spyOn(prisma.user, 'findUnique')
      .mockResolvedValue({ profileImg: profilePictureMock });
    jest
      .spyOn(imageStore, 'deleteUserImage')
      .mockResolvedValue({ result: 'not_found' });
    await expect(useCase.execute({ id: payloadMock.id })).rejects.toThrow(
      BadRequestException,
    );
    expect(imageStore.deleteUserImage).toHaveBeenCalledWith({
      fileUrl: profilePictureMock,
      folder: ImageStoreTypeFolder.PROFILE,
    });
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: {
        id: payloadMock.id,
      },
      select: { profileImg: true },
    });
  });
});
