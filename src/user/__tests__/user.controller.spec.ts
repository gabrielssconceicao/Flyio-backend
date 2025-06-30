import { Test, TestingModule } from '@nestjs/testing';

import { HashingModule } from '@/hash/hashing.module';
import { fileMock } from '@/image-store/mock';

import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import {
  createUserDtoMock,
  userEntityMock,
  userMock,
  searchUsersResponseMock,
  getLikesMock,
} from '../mocks';
import { payloadMock } from '@/auth/mock/token-payload.mock';
import { findManyPostMock } from '@/post/mock';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;
  const paginationDtoMock = { offset: 0, limit: 25 };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HashingModule],
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            search: jest.fn(),
            getFollowings: jest.fn(),
            getFollowers: jest.fn(),
            getPosts: jest.fn(),
            getLikedPosts: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    jest.spyOn(service, 'create').mockResolvedValue(userEntityMock());
    const result = await controller.create(createUserDtoMock(), {
      bannerImg: [fileMock()],
      profileImg: [fileMock()],
    });
    expect(service.create).toHaveBeenCalledWith({
      createUserDto: createUserDtoMock(),
      profileImage: fileMock(),
      bannerImage: fileMock(),
    });
    expect(result).toBeDefined();
    expect(result).toMatchSnapshot();
  });

  it('should find a user', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValue({ user: userMock() });
    const result = await controller.findOne('username');
    expect(service.findOne).toHaveBeenCalledWith({ username: 'username' });
    expect(result).toMatchSnapshot();
  });

  it('should find users by name or username', async () => {
    const query = { search: 'johndoe', ...paginationDtoMock };
    jest.spyOn(service, 'search').mockResolvedValue(searchUsersResponseMock());
    const result = await controller.search(query);
    expect(service.search).toHaveBeenCalledWith({ query });
    expect(result).toMatchSnapshot();
  });

  it('should get users that a user follow', async () => {
    jest
      .spyOn(service, 'getFollowings')
      .mockResolvedValue(searchUsersResponseMock());
    const result = await controller.getFollowings(
      'username',
      paginationDtoMock,
    );
    expect(service.getFollowings).toHaveBeenCalledWith({
      username: 'username',
      query: paginationDtoMock,
    });
    expect(result).toMatchSnapshot();
  });

  it('should get users that follow a user', async () => {
    jest
      .spyOn(service, 'getFollowers')
      .mockResolvedValue(searchUsersResponseMock());
    const result = await controller.getFollowers('username', paginationDtoMock);
    expect(service.getFollowers).toHaveBeenCalledWith({
      username: 'username',
      query: paginationDtoMock,
    });
    expect(result).toMatchSnapshot();
  });

  it('should get user liked posts', () => {
    jest.spyOn(service, 'getLikedPosts').mockResolvedValue(getLikesMock());
    const result = controller.getLikedPosts(
      payloadMock,
      'username',
      paginationDtoMock,
    );
    expect(service.getLikedPosts).toHaveBeenCalledWith({
      username: 'username',
      query: paginationDtoMock,
      payload: payloadMock,
    });
    expect(result).toMatchSnapshot();
  });

  it('should get user posts', () => {
    jest.spyOn(service, 'getPosts').mockResolvedValue({
      count: 1,
      items: findManyPostMock().items.map((post) => ({
        ...post,
        parent: { author: { username: 'johndoe' } },
      })),
    });
    const result = controller.getPosts(
      'username',

      paginationDtoMock,
      payloadMock,
    );
    expect(service.getPosts).toHaveBeenCalledWith({
      username: 'username',
      query: paginationDtoMock,
      payload: payloadMock,
    });
    expect(result).toMatchSnapshot();
  });
});
