import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { prismaServiceMock } from '@/prisma/prisma.service.mock';
import { HashingService } from '@/hash/hashing.service';
import { PrismaService } from '@/prisma/prisma.service';
import { UserImageStoreUseCase } from '@/image-store/use-cases';
import { userImageStoreUseCaseMock } from '@/image-store/mock';
import { UserService } from '../user.service';
import { searchUsersResponseMock } from '../mocks/search-users-response.mock';
import { getLikesMock } from '../mocks/get-likes.mock';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { findManyPostMock, postMock } from '@/post/mock';
import { GetUserUseCase } from '../use-cases/get-user.use-case';
import { CreateUserUseCase } from '../use-cases/create-user.use-case';
import { userEntityMock } from '../mocks/user-entity.mock';
import { userMock } from '../mocks/user.mock';
import { createUserDtoMock } from '../mocks/create-user-dto.mock';
import { SearchUserEntity } from '../entities/search-user.entity';
import { SearchUserUseCase } from '../use-cases';

describe('UserService', () => {
  let service: UserService;
  let hashingService: HashingService;
  let prisma: ReturnType<typeof prismaServiceMock>;
  const paginationDtoMock = { offset: 0, limit: 25 };
  const payload = { id: 'id-1' } as JwtPayload;

  let getUser: GetUserUseCase;
  let createUser: CreateUserUseCase;
  let searchUser: SearchUserUseCase;
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
        {
          provide: UserImageStoreUseCase,
          useValue: userImageStoreUseCaseMock(),
        },
        {
          provide: GetUserUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: CreateUserUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: SearchUserEntity,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    hashingService = module.get<HashingService>(HashingService);

    getUser = module.get<GetUserUseCase>(GetUserUseCase);
    createUser = module.get<CreateUserUseCase>(CreateUserUseCase);
    searchUser = module.get<SearchUserUseCase>(SearchUserUseCase);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(hashingService).toBeDefined();
    expect(prisma).toBeDefined();

    expect(searchUser).toBeDefined();
    expect(getUser).toBeDefined();
    expect(createUser).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get a user', async () => {
    jest.spyOn(getUser, 'execute').mockResolvedValue({ user: userMock() });
    const result = await service.findOne('johndoe');
    expect(getUser.execute).toHaveBeenCalledWith({ username: 'johndoe' });
    expect(result).toMatchSnapshot();
  });

  it('should create a user', async () => {
    jest.spyOn(createUser, 'execute').mockResolvedValue(userEntityMock());
    const result = await service.create({
      bannerImage: null,
      profileImage: null,
      createUserDto: createUserDtoMock(),
    });
    expect(createUser.execute).toHaveBeenCalledWith({
      bannerImage: null,
      profileImage: null,
      createUserDto: createUserDtoMock(),
    });
    expect(result).toMatchSnapshot();
  });

  it('should search users', async () => {
    jest
      .spyOn(searchUser, 'execute')
      .mockResolvedValue(searchUsersResponseMock());
    const query = {
      limit: 20,
      offset: 0,
      search: 'johndoe',
    };
    const result = await service.search(query);

    expect(searchUser.execute).toHaveBeenCalledWith(query);
    expect(result).toMatchSnapshot();
  });

  describe('GetFollowings', () => {
    it('should get a user followings', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
        id: 'id-1',
      });

      jest.spyOn(prisma.follow, 'findMany').mockResolvedValue(
        searchUsersResponseMock().items.map((user) => {
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
      expect(result.items).toEqual(searchUsersResponseMock().items);
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
        searchUsersResponseMock().items.map((user) => {
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
      expect(result.items).toEqual(searchUsersResponseMock().items);
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

  describe('GetLikedPosts', () => {
    it('should get a user liked posts', async () => {
      jest.spyOn(prisma.likePost, 'findMany').mockResolvedValue(
        getLikesMock().items.map((item) => ({
          post: {
            ...item,
            _count: { replies: 0, likes: 0 },
            likes: [],
          },
        })),
      );
      jest
        .spyOn(prisma.likePost, 'count')
        .mockResolvedValue(getLikesMock().count);
      const result = await service.getLikedPosts({
        username: 'username',
        query: paginationDtoMock,
        payload,
      });
      expect(prisma.likePost.findMany).toHaveBeenCalled();
      expect(prisma.likePost.count).toHaveBeenCalled();
      expect(result).toMatchSnapshot();
      expect(result.count).toEqual(getLikesMock().count);
      expect(result.items).toEqual(getLikesMock().items);
    });
  });

  describe('GetPosts', () => {
    it('should return an array of post', async () => {
      jest.spyOn(prisma.post, 'findMany').mockResolvedValue(
        findManyPostMock().items.map((post) => ({
          ...post,
          ...{ _count: { replies: 0, likes: 0 } },
        })),
      );
      jest
        .spyOn(prisma.post, 'count')
        .mockResolvedValue(findManyPostMock().count);

      const result = await service.getPosts({
        username: 'username',
        query: paginationDtoMock,
        payload,
      });

      expect(prisma.post.findMany).toHaveBeenCalled();
      expect(prisma.post.count).toHaveBeenCalled();
      expect(result).toEqual(findManyPostMock());
      expect(result).toMatchSnapshot();
    });
  });

  describe('GetReplies', () => {
    it('should get user replies', async () => {
      jest.spyOn(prisma.post, 'findMany').mockResolvedValue([
        {
          ...postMock(),
          likes: [],
          _count: { replies: 0, likes: 0 },
          parent: { author: { username: 'johndoe' } },
        },
      ]);
      jest.spyOn(prisma.post, 'count').mockResolvedValue(1);

      const result = await service.getComments({
        username: 'username',
        payload,
        query: paginationDtoMock,
      });

      expect(prisma.post.findMany).toHaveBeenCalled();
      expect(result).toMatchSnapshot();
    });
  });
});
