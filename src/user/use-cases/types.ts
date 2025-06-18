import { CreateUserDto } from '../dto/create-user.dto';

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
