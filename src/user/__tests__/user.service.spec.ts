import { Test, TestingModule } from '@nestjs/testing';

import { prismaServiceMock } from '@/prisma/prisma.service.mock';
import { PrismaService } from '@/prisma/prisma.service';

import { HashingService } from '@/hash/hashing.service';
import { UserImageStoreUseCase } from '@/image-store/use-cases';
import { userImageStoreUseCaseMock } from '@/image-store/mock';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { findManyPostMock, postMock } from '@/post/mock';

import { UserService } from '../user.service';
import {
  createUserDtoMock,
  getLikesMock,
  searchUsersResponseMock,
  userEntityMock,
  userMock,
} from '../mocks';

import {
  GetFollowersUseCase,
  GetFollowingsUseCase,
  SearchUserUseCase,
  CreateUserUseCase,
  GetUserUseCase,
} from '../use-cases';

describe('UserService', () => {
  let service: UserService;
  let hashingService: HashingService;
  let prisma: ReturnType<typeof prismaServiceMock>;
  const paginationDtoMock = { offset: 0, limit: 25 };
  const payload = { id: 'id-1' } as JwtPayload;

  let getUser: GetUserUseCase;
  let createUser: CreateUserUseCase;
  let searchUser: SearchUserUseCase;
  let getFollowings: GetFollowingsUseCase;
  let getFollowers: GetFollowersUseCase;
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
          provide: SearchUserUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: GetFollowingsUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: GetFollowersUseCase,
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
    getFollowings = module.get<GetFollowingsUseCase>(GetFollowingsUseCase);
    getFollowers = module.get<GetFollowersUseCase>(GetFollowersUseCase);
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

  it('should get users that a user is following', async () => {
    jest
      .spyOn(prisma.user, 'findUnique')
      .mockResolvedValue(searchUsersResponseMock());

    const result = await service.getFollowings({
      username: 'username',
      query: paginationDtoMock,
    });
    expect(getFollowings.execute).toHaveBeenCalledWith({
      username: 'username',
      query: paginationDtoMock,
    });
    expect(result).toMatchSnapshot();
  });

  it('should get users that follow a user', async () => {
    jest
      .spyOn(prisma.user, 'findUnique')
      .mockResolvedValue(searchUsersResponseMock());

    const result = await service.getFollowers({
      username: 'username',
      query: paginationDtoMock,
    });
    expect(getFollowers.execute).toHaveBeenCalledWith({
      username: 'username',
      query: paginationDtoMock,
    });
    expect(result).toMatchSnapshot();
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
