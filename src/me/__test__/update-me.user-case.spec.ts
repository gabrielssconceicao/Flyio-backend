import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '@/prisma/prisma.service';
import { prismaServiceMock } from '@/prisma/prisma.service.mock';

import { payloadMock } from '@/auth/mock/token-payload.mock';
import { HashingService } from '@/hash/hashing.service';

import { UserImageStoreUseCase } from '@/image-store/use-cases';
import {
  fileMock,
  profilePictureMock,
  userImageStoreUseCaseMock,
} from '@/image-store/mock';
import { ImageStoreTypeFolder } from '@/image-store/image-store.constants';

import { currentUserMock } from '../mocks/current-user.mock';
import { MeMapper } from '../me.mapper';
import { UpdateMeUseCase } from '../use-cases';
import { Count } from '../use-cases/types';
import { UpdateMeDto } from '../dto/update-me.dto';

describe('UpdateMeUseCase', () => {
  let useCase: UpdateMeUseCase;
  let hashing: HashingService;
  let imageStore: UserImageStoreUseCase;
  let prisma: ReturnType<typeof prismaServiceMock>;
  let _count: Count;
  beforeEach(async () => {
    prisma = prismaServiceMock();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateMeUseCase,
        {
          provide: HashingService,
          useValue: {
            hash: jest.fn(),
          },
        },
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

    useCase = module.get<UpdateMeUseCase>(UpdateMeUseCase);
    hashing = module.get<HashingService>(HashingService);
    imageStore = module.get<UserImageStoreUseCase>(UserImageStoreUseCase);

    _count = { _count: { followers: 0, following: 0 } };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
    expect(prisma).toBeDefined();
    expect(hashing).toBeDefined();
    expect(imageStore).toBeDefined();
  });

  it('should update current user', async () => {
    const hashedPassword = 'hashedPassword';
    const updateMeDto: UpdateMeDto = {
      name: 'Updated name',
      password: 'newPassword',
    };

    jest.spyOn(hashing, 'hash').mockResolvedValue(hashedPassword);
    jest.spyOn(prisma.user, 'update').mockResolvedValue({
      ...currentUserMock(),
      ..._count,
      password: hashedPassword,
    });

    const result = await useCase.execute({
      payload: payloadMock,
      updateMeDto,
      bannerImage: null,
      profileImage: null,
    });

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: {
        id: payloadMock.id,
      },
      data: {
        name: updateMeDto.name,
        password: hashedPassword,
        bannerImg: undefined,
        profileImg: undefined,
      },
      select: { ...MeMapper.defaultFields, ...MeMapper.followCountFields },
    });
    expect(hashing.hash).toHaveBeenCalledWith(updateMeDto.password);
    expect(result).toMatchSnapshot();
  });

  it('should update current user with images', async () => {
    const uppdateMeDto: UpdateMeDto = {
      password: undefined,
      bio: undefined,
      name: undefined,
    };

    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
      bannerImg: profilePictureMock,
      profileImg: null,
    });

    jest
      .spyOn(imageStore, 'uploadUserImage')
      .mockResolvedValue(profilePictureMock);
    jest
      .spyOn(imageStore, 'updateUserImage')
      .mockResolvedValue(profilePictureMock);

    jest.spyOn(prisma.user, 'update').mockResolvedValue({
      ...currentUserMock(),
      ..._count,
      prfileImg: profilePictureMock,
      bannerImg: profilePictureMock,
    });

    const result = await useCase.execute({
      payload: payloadMock,
      updateMeDto: uppdateMeDto,
      bannerImage: fileMock(),
      profileImage: fileMock(),
    });

    expect(result).toMatchSnapshot();

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: {
        id: payloadMock.id,
      },
      select: { bannerImg: true, profileImg: true },
    });

    expect(imageStore.uploadUserImage).toHaveBeenCalledWith({
      file: fileMock(),
      folder: ImageStoreTypeFolder.PROFILE,
    });

    expect(imageStore.updateUserImage).toHaveBeenCalledWith({
      file: fileMock(),
      folder: ImageStoreTypeFolder.BANNER,
      filename: profilePictureMock,
    });

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: {
        id: payloadMock.id,
      },
      data: {
        ...uppdateMeDto,
        bannerImg: profilePictureMock,
        profileImg: profilePictureMock,
      },
      select: { ...MeMapper.defaultFields, ...MeMapper.followCountFields },
    });
  });
});
