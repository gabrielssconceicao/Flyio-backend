import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { QueryParamDto } from '@/common/dto/query-param.dto';
import { CreatePostDto } from '../dto/create-post.dto';

export type CreatePost = {
  createPostDto: CreatePostDto;
  payload: JwtPayload;
  images: Express.Multer.File[];
};

export type PostParam = {
  postId: string;
  payload: JwtPayload;
};

export type FindMany = {
  payload: JwtPayload;
  query: QueryParamDto;
};

export type CommentPost = CreatePost & {
  postId: string;
};
