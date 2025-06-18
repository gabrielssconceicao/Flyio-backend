import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { HashingModule } from '@/hash/hashing.module';
import { ImageStoreModule } from '@/image-store/image-store.module';
import { CreateUserUseCase, GetUserUseCase } from './use-cases';
@Module({
  imports: [HashingModule, ImageStoreModule],
  controllers: [UserController],
  providers: [CreateUserUseCase, GetUserUseCase, UserService],
})
export class UserModule {}
