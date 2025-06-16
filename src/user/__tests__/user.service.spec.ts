import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { prismaServiceMock } from '@/prisma/prisma.service.mock';
import { HashingService } from '@/hash/hashing.service';
import { PrismaService } from '@/prisma/prisma.service';
import { ImageStoreService } from '@/image-store/image-store.service';
import { imageStoreServiceMock } from '@/image-store/mock/image-store.mock';
import { fileMock, profilePictureMock } from '@/image-store/mock/file.mock';
import { UserService } from '../user.service';
import { UserMapper } from '../user.mapper';
import { CreateUserDto } from '../dto/create-user.dto';
import { createUserDtoMock } from '../mocks/create-user-dto.mock';
import { userEntityMock } from '../mocks/user-entity.mock';
import { userMock } from '../mocks/user.mock';
import { searchUsersResponseMock } from '../mocks/search-users-response.mock';
import { getLikesMock } from '../mocks/get-likes.mock';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { findManyPostMock, postMock } from '@/post/mock';

describe('UserService', () => {
  let service: UserService;
  let hashingService: HashingService;
  let imageStore: ImageStoreService;
  let prisma: ReturnType<typeof prismaServiceMock>;
  const paginationDtoMock = { offset: 0, limit: 25 };
  const payload = { id: 'id-1' } as JwtPayload;
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
          provide: ImageStoreService,
          useValue: imageStoreServiceMock(),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    hashingService = module.get<HashingService>(HashingService);
    imageStore = module.get<ImageStoreService>(ImageStoreService);
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
    let file: Express.Multer.File;
    beforeEach(() => {
      createUserDto = createUserDtoMock();
      file = fileMock();
    });

    it('should create a user without profile and banner', async () => {
      const hashedPassword = 'hashedPassword';
      jest.spyOn(hashingService, 'hash').mockResolvedValue(hashedPassword);
      jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(null);
      jest
        .spyOn(prisma.user, 'create')
        .mockResolvedValue(userEntityMock() as any);

      const result = await service.create({
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
      } as any);

      const result = await service.create({
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
        service.create({
          createUserDto,
          profileImage: null,
          bannerImage: null,
        }),
      ).rejects.toThrow(ConflictException);
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
        .mockResolvedValue(searchUsersResponseMock().items);

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
