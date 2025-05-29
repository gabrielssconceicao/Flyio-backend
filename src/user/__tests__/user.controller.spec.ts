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
      const query = { search: 'johndoe', limit: 25 };
      jest
        .spyOn(service, 'search')
        .mockResolvedValue(searchUsersResponseMock());
      const result = await controller.search(query);
      expect(service.search).toHaveBeenCalledWith(query);
      expect(result).toMatchSnapshot();
    });
  });
});
