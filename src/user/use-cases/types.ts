import { PaginationDto } from '@/common/dto/pagination.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { JwtPayload } from 'jsonwebtoken';

export type GetUserParam = {
  username: string;
};

export type Count = {
  _count: {
    followers: number;
    following: number;
  };
};
export type CreateUserParams = {
  createUserDto: CreateUserDto;
  profileImage: Express.Multer.File | null;
  bannerImage: Express.Multer.File | null;
};

// change name
export type GetFollowingsParam = {
  username: string;
  query: PaginationDto;
};

export type PostRelationParam = {
  username: string;
  query: PaginationDto;
  payload: JwtPayload;
};
