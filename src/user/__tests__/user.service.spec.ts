import { Test, TestingModule } from '@nestjs/testing';

import { UserImageStoreUseCase } from '@/image-store/use-cases';
import { userImageStoreUseCaseMock } from '@/image-store/mock';
import { findManyPostMock } from '@/post/mock';
import { payloadMock } from '@/auth/mock/token-payload.mock';

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
  GetUserPostsUseCase,
  GetUserLikedPostUseCase,
} from '../use-cases';

const mock = {
  execute: jest.fn(),
};
describe('UserService', () => {
  let service: UserService;
  const paginationDtoMock = { offset: 0, limit: 25 };

  let getUser: GetUserUseCase;
  let createUser: CreateUserUseCase;
  let searchUser: SearchUserUseCase;
  let getFollowings: GetFollowingsUseCase;
  let getFollowers: GetFollowersUseCase;
  let getUserLikedPost: GetUserLikedPostUseCase;
  let getUserPosts: GetUserPostsUseCase;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,

        {
          provide: UserImageStoreUseCase,
          useValue: userImageStoreUseCaseMock(),
        },
        {
          provide: GetUserUseCase,
          useValue: mock,
        },
        {
          provide: CreateUserUseCase,
          useValue: mock,
        },
        {
          provide: SearchUserUseCase,
          useValue: mock,
        },
        {
          provide: GetFollowingsUseCase,
          useValue: mock,
        },
        {
          provide: GetFollowersUseCase,
          useValue: mock,
        },
        {
          provide: GetUserLikedPostUseCase,
          useValue: mock,
        },
        {
          provide: GetUserPostsUseCase,
          useValue: mock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);

    getUser = module.get<GetUserUseCase>(GetUserUseCase);
    createUser = module.get<CreateUserUseCase>(CreateUserUseCase);
    searchUser = module.get<SearchUserUseCase>(SearchUserUseCase);
    getFollowings = module.get<GetFollowingsUseCase>(GetFollowingsUseCase);
    getFollowers = module.get<GetFollowersUseCase>(GetFollowersUseCase);
    getUserLikedPost = module.get<GetUserLikedPostUseCase>(
      GetUserLikedPostUseCase,
    );
    getUserPosts = module.get<GetUserPostsUseCase>(GetUserPostsUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();

    expect(searchUser).toBeDefined();
    expect(getUser).toBeDefined();
    expect(createUser).toBeDefined();
    expect(getFollowers).toBeDefined();
    expect(getFollowings).toBeDefined();
    expect(getUserLikedPost).toBeDefined();
    expect(getUserPosts).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get a user', async () => {
    jest.spyOn(getUser, 'execute').mockResolvedValue({ user: userMock() });
    const result = await service.findOne({ username: 'johndoe' });
    expect(getUser.execute).toHaveBeenCalledWith({ username: 'johndoe' });
    expect(result).toMatchSnapshot();
  });

  it('should create a user', async () => {
    const body = {
      bannerImage: null,
      profileImage: null,
      createUserDto: createUserDtoMock(),
    };
    jest.spyOn(createUser, 'execute').mockResolvedValue(userEntityMock());
    const result = await service.create(body);
    expect(createUser.execute).toHaveBeenCalledWith(body);
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
    const result = await service.search({ query });

    expect(searchUser.execute).toHaveBeenCalledWith(query);
    expect(result).toMatchSnapshot();
  });

  it('should get users that a user is following', async () => {
    const body = {
      username: 'username',
      query: paginationDtoMock,
    };
    const result = await service.getFollowings(body);
    expect(getFollowings.execute).toHaveBeenCalledWith(body);
    expect(result).toMatchSnapshot();
  });

  it('should get users that follow a user', async () => {
    const body = {
      username: 'username',
      query: paginationDtoMock,
    };
    const result = await service.getFollowers(body);
    expect(getFollowers.execute).toHaveBeenCalledWith(body);
    expect(result).toMatchSnapshot();
  });

  it('should get liked posts by a user', async () => {
    jest.spyOn(getUserLikedPost, 'execute').mockResolvedValue(getLikesMock());
    const body = {
      username: 'username',
      query: paginationDtoMock,
      payload: payloadMock,
    };
    const result = await service.getLikedPosts(body);
    expect(getUserLikedPost.execute).toHaveBeenCalledWith(body);
    expect(result).toMatchSnapshot();
  });

  it('should get user posts', async () => {
    jest.spyOn(getUserPosts, 'execute').mockResolvedValue({
      count: findManyPostMock().count,
      items: findManyPostMock().items.map((post) => ({
        ...post,
        parent: { author: { username: 'johndoe' } },
      })),
    });

    const body = {
      username: 'username',
      query: paginationDtoMock,
      payload: payloadMock,
    };
    const result = await service.getPosts(body);
    expect(getUserPosts.execute).toHaveBeenCalledWith(body);
    expect(result).toMatchSnapshot();
  });
});
