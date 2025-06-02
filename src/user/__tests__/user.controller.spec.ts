import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { createUserDtoMock } from '../mocks/create-user-dto.mock';
import { HashingModule } from '@/hash/hashing.module';
import { userEntityMock } from '../mocks/user-entity.mock';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { userMock } from '../mocks/user.mock';
import { searchUsersResponseMock } from '../mocks/search-users-response.mock';

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

  describe('Create', () => {
    it('should create a user', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(userEntityMock());
      const result = await controller.create(createUserDtoMock());
      expect(result).toBeDefined();
      expect(result).toMatchSnapshot();
    });

    it('should throw a conflict exception', async () => {
      jest.spyOn(service, 'create').mockRejectedValue(new ConflictException());
      await expect(controller.create(createUserDtoMock())).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('FindOne', () => {
    it('should find a user', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue({ user: userMock() });
      const result = await controller.findOne('username');
      expect(result).toMatchSnapshot();
    });

    it('should throw a not found exception if user not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());
      await expect(controller.findOne('username')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('Search', () => {
    it('should find users by name or username', async () => {
      const query = { search: 'johndoe', ...paginationDtoMock };
      jest
        .spyOn(service, 'search')
        .mockResolvedValue(searchUsersResponseMock());
      const result = await controller.search(query);
      expect(service.search).toHaveBeenCalledWith(query);
      expect(result).toMatchSnapshot();
    });
  });

  describe('Following', () => {
    it('should get following users by a user', async () => {
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

    it('should throw a not found exception if user not found', async () => {
      jest
        .spyOn(service, 'getFollowings')
        .mockRejectedValue(new NotFoundException());
      await expect(
        controller.getFollowings('username', paginationDtoMock),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('Followers', () => {
    it('should get followers users by a user', async () => {
      jest
        .spyOn(service, 'getFollowers')
        .mockResolvedValue(searchUsersResponseMock());
      const result = await controller.getFollowers(
        'username',
        paginationDtoMock,
      );
      expect(service.getFollowers).toHaveBeenCalledWith({
        username: 'username',
        query: paginationDtoMock,
      });
      expect(result).toMatchSnapshot();
    });

    it('should throw a not found exception if user not found', async () => {
      jest
        .spyOn(service, 'getFollowers')
        .mockRejectedValue(new NotFoundException());
      await expect(
        controller.getFollowers('username', paginationDtoMock),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
