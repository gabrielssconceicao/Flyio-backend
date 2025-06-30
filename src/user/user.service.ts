import { Injectable } from '@nestjs/common';
import { FindManyPostEntity } from '@/post/entities/find-many.entity';
import { QueryParamDto } from '@/common/dto/query-param.dto';

import {
  FindOneUserEntity,
  UserEntity,
  SearchUserEntity,
  GetLikedPostEntity,
} from './entities';
import {
  CreateUserParams,
  GetFollowingsParam,
  PostRelationParam,
} from './use-cases/types';
import {
  CreateUserUseCase,
  GetFollowingsUseCase,
  GetFollowersUseCase,
  GetUserUseCase,
  SearchUserUseCase,
  GetUserLikedPostUseCase,
  GetUserPostsUseCase,
} from './use-cases';

@Injectable()
export class UserService {
  constructor(
    private readonly getUser: GetUserUseCase,
    private readonly createUser: CreateUserUseCase,
    private readonly searchUser: SearchUserUseCase,
    private readonly getFollowing: GetFollowingsUseCase,
    private readonly getFollower: GetFollowersUseCase,
    private readonly getUserLikedPost: GetUserLikedPostUseCase,
    private readonly getUserPosts: GetUserPostsUseCase,
  ) {}

  async create({
    createUserDto,
    bannerImage,
    profileImage,
  }: CreateUserParams): Promise<UserEntity> {
    return this.createUser.execute({
      createUserDto,
      bannerImage,
      profileImage,
    });
  }

  async search({ query }: { query: QueryParamDto }): Promise<SearchUserEntity> {
    return this.searchUser.execute(query);
  }

  async findOne({
    username,
  }: {
    username: string;
  }): Promise<{ user: FindOneUserEntity }> {
    return this.getUser.execute({ username });
  }

  async getFollowings({
    username,
    query,
  }: GetFollowingsParam): Promise<SearchUserEntity> {
    return this.getFollowing.execute({ username, query });
  }

  async getFollowers({
    username,
    query,
  }: GetFollowingsParam): Promise<SearchUserEntity> {
    return this.getFollower.execute({ username, query });
  }

  async getLikedPosts({
    query,
    username,
    payload,
  }: PostRelationParam): Promise<GetLikedPostEntity> {
    return this.getUserLikedPost.execute({ query, username, payload });
  }

  async getPosts({
    query,
    username,
    payload,
  }: PostRelationParam): Promise<FindManyPostEntity> {
    return this.getUserPosts.execute({ query, username, payload });
  }
}
