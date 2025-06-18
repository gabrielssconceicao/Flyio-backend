import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
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
