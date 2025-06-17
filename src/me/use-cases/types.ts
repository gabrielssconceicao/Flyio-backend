import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { UpdateMeDto } from '../dto/update-me.dto';

export type Id = { id: string };

export type Count = { _count: { followers: number; following: number } };
export type UpdateProfileImageParams = {
  profileImage: Express.Multer.File | null;
  bannerImage: Express.Multer.File | null;
};
export type UpdateMeParams = {
  payload: JwtPayload;
  updateMeDto: UpdateMeDto;
};

export type UpdateProfileImageAndMeParams = UpdateMeParams &
  UpdateProfileImageParams;
