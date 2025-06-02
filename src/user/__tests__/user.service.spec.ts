import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { HashingService } from '@/hash/hashing.service';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserMapper } from '../user.mapper';
import { createUserDtoMock } from '../mocks/create-user-dto.mock';
import { userEntityMock } from '../mocks/user-entity.mock';
import { prismaServiceMock } from '@/prisma/prisma.service.mock';
import { userMock } from '../mocks/user.mock';
import { searchUsersResponseMock } from '../mocks/search-users-response.mock';

describe('UserService', () => {
  let service: UserService;
  let hashingService: HashingService;
  let prisma: ReturnType<typeof prismaServiceMock>;
  const paginationDtoMock = { offset: 0, limit: 25 };
  beforeEach(async () => {
    prisma = prismaServiceMock();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
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
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    hashingService = module.get<HashingService>(HashingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(hashingService).toBeDefined();
    expect(prisma).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Create', () => {
    let createUserDto: CreateUserDto;
    beforeEach(() => {
      createUserDto = createUserDtoMock();
    });

    it('should create a user without profile and banner', async () => {
      const hashedPassword = 'hashedPassword';
      jest.spyOn(hashingService, 'hash').mockResolvedValue(hashedPassword);
      jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(null);
      jest
        .spyOn(prisma.user, 'create')
        .mockResolvedValue(userEntityMock() as any);

      const result = await service.create(createUserDto);
      expect(prisma.user.findFirst).toHaveBeenCalledTimes(1);
      expect(hashingService.hash).toHaveBeenCalledWith(createUserDto.password);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: { ...createUserDto, password: hashedPassword },
        select: UserMapper.createUserFields,
      });
      expect(result).toBeDefined();
      expect(result).toMatchSnapshot();
    });

    it('should throw an conflict exception', async () => {
      jest.spyOn(prisma.user, 'findFirst').mockResolvedValue({
        email: createUserDto.email,
        username: createUserDto.username,
      } as any);

      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('FindOne', () => {
    it('should find a user', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
        ...userMock(),
        _count: { followers: 0, following: 0 },
      } as any);

      const result = await service.findOne('jonhdoe');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { username: 'jonhdoe' },
        select: UserMapper.findUserFields,
      });

      expect(result.user).toEqual(userMock());
      expect(result).toMatchSnapshot();
    });

    it('should throw a not found exception if user not found', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne('username')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('Search', () => {
    it('should find users by name or username', async () => {
      jest
        .spyOn(prisma.user, 'findMany')
        .mockResolvedValue(searchUsersResponseMock().users);

      jest
        .spyOn(prisma.user, 'count')
        .mockResolvedValue(searchUsersResponseMock().count);
      const result = await service.search({
        search: 'johndoe',
        ...paginationDtoMock,
      });
      expect(prisma.user.count).toHaveBeenCalled();
      expect(prisma.user.findMany).toHaveBeenCalled();
      expect(result).toMatchSnapshot();
    });
  });

  describe('GetFollowings', () => {
    it('should get a user followings', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
        id: 'id-1',
      });

      jest.spyOn(prisma.follow, 'findMany').mockResolvedValue(
        searchUsersResponseMock().users.map((user) => {
          return { followed: user };
        }),
      );
      jest
        .spyOn(prisma.follow, 'count')
        .mockResolvedValue(searchUsersResponseMock().count);

      const result = await service.getFollowings({
        username: 'username',
        query: paginationDtoMock,
      });
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { username: 'username' },
        select: { id: true },
      });
      expect(prisma.follow.findMany).toHaveBeenCalled();
      expect(prisma.follow.count).toHaveBeenCalledWith({
        where: { userId: 'id-1' },
      });
      expect(result).toMatchSnapshot();
      expect(result.count).toEqual(searchUsersResponseMock().count);
      expect(result.users).toEqual(searchUsersResponseMock().users);
    });
    it('should throw a not found exception if user not found', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      await expect(
        service.getFollowings({
          username: 'username',
          query: paginationDtoMock,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('GetFollowers', () => {
    it('should get a user followers', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
        id: 'id-1',
      });

      jest.spyOn(prisma.follow, 'findMany').mockResolvedValue(
        searchUsersResponseMock().users.map((user) => {
          return { follower: user };
        }),
      );
      jest
        .spyOn(prisma.follow, 'count')
        .mockResolvedValue(searchUsersResponseMock().count);

      const result = await service.getFollowers({
        username: 'username',
        query: paginationDtoMock,
      });
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { username: 'username' },
        select: { id: true },
      });
      expect(prisma.follow.findMany).toHaveBeenCalled();
      expect(prisma.follow.count).toHaveBeenCalledWith({
        where: { followingUserId: 'id-1' },
      });
      expect(result).toMatchSnapshot();
      expect(result.count).toEqual(searchUsersResponseMock().count);
      expect(result.users).toEqual(searchUsersResponseMock().users);
    });

    it('should throw a not found exception if user not found', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      await expect(
        service.getFollowers({
          username: 'username',
          query: paginationDtoMock,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
