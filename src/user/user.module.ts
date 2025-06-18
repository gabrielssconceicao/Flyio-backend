import { Module } from '@nestjs/common';
import { HashingModule } from '@/hash/hashing.module';
import { ImageStoreModule } from '@/image-store/image-store.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {
  CreateUserUseCase,
  GetUserUseCase,
  GetFollowersUseCase,
  GetFollowingsUseCase,
  SearchUserUseCase,
} from './use-cases';
@Module({
  imports: [HashingModule, ImageStoreModule],
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    GetUserUseCase,
    GetFollowersUseCase,
    GetFollowingsUseCase,
    SearchUserUseCase,
    UserService,
  ],
})
export class UserModule {}
