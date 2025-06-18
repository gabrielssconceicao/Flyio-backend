import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';

import { prismaServiceMock } from '@/prisma/prisma.service.mock';
import { PrismaService } from '@/prisma/prisma.service';
import { HashingService } from '@/hash/hashing.service';
import { UserImageStoreUseCase } from '@/image-store/use-cases';
import {
  fileMock,
  profilePictureMock,
  userImageStoreUseCaseMock,
} from '@/image-store/mock';

import { UserMapper } from '../user.mapper';
import { CreateUserUseCase } from '../use-cases';
import { CreateUserDto } from '../dto/create-user.dto';
import { createUserDtoMock, userEntityMock } from '../mocks';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let hashingService: HashingService;
  let prisma: ReturnType<typeof prismaServiceMock>;
  let imageStore: UserImageStoreUseCase;
  let createUserDto: CreateUserDto;
  let file: Express.Multer.File;
  beforeEach(async () => {
    prisma = prismaServiceMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: HashingService,
          useValue: {
            hash: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: prisma,
        },
        {
          provide: UserImageStoreUseCase,
          useValue: userImageStoreUseCaseMock(),
        },
      ],
    }).compile();

    useCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    hashingService = module.get<HashingService>(HashingService);
    imageStore = module.get<UserImageStoreUseCase>(UserImageStoreUseCase);
    createUserDto = createUserDtoMock();
    file = fileMock();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
    expect(hashingService).toBeDefined();
    expect(prisma).toBeDefined();
    expect(imageStore).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a user without profile and banner', async () => {
    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(null);
    const hashedPassword = 'hashedPassword';
    jest.spyOn(hashingService, 'hash').mockResolvedValue(hashedPassword);
    jest
      .spyOn(prisma.user, 'create')
      .mockResolvedValue(userEntityMock() as any);

    const result = await useCase.execute({
      createUserDto,
      profileImage: null,
      bannerImage: null,
    });
    expect(prisma.user.findFirst).toHaveBeenCalledTimes(1);
    expect(hashingService.hash).toHaveBeenCalledWith(createUserDto.password);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        ...createUserDto,
        password: hashedPassword,
        profileImg: null,
        bannerImg: null,
      },
      select: UserMapper.createUserFields,
    });
    expect(imageStore.uploadUserImage).not.toHaveBeenCalled();
    expect(result).toBeDefined();
    expect(result).toMatchSnapshot();
  });

  it('should create a user with profile and banner', async () => {
    const hashedPassword = 'hashedPassword';
    jest.spyOn(hashingService, 'hash').mockResolvedValue(hashedPassword);
    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(null);
    jest
      .spyOn(imageStore, 'uploadUserImage')
      .mockResolvedValueOnce(profilePictureMock)
      .mockResolvedValueOnce(profilePictureMock);
    jest.spyOn(prisma.user, 'create').mockResolvedValue({
      ...userEntityMock(),
      profileImg: profilePictureMock,
    });

    const result = await useCase.execute({
      createUserDto,
      profileImage: file,
      bannerImage: file,
    });
    expect(prisma.user.findFirst).toHaveBeenCalled();
    expect(hashingService.hash).toHaveBeenCalledWith(createUserDto.password);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        ...createUserDto,
        password: hashedPassword,
        profileImg: profilePictureMock,
        bannerImg: profilePictureMock,
      },
      select: UserMapper.createUserFields,
    });
    expect(imageStore.uploadUserImage).toHaveBeenCalledTimes(2);
    expect(result).toBeDefined();
    expect(result).toMatchSnapshot();
  });

  it('should throw an conflict exception', async () => {
    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue({
      email: createUserDto.email,
      username: createUserDto.username,
    } as any);

    await expect(
      useCase.execute({
        createUserDto,
        profileImage: null,
        bannerImage: null,
      }),
    ).rejects.toThrow(ConflictException);
  });
});
