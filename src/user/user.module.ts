import { Module } from '@nestjs/common';
import { HashingModule } from '@/hash/hashing.module';
import { ImageStoreModule } from '@/image-store/image-store.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserUseCasesProviders } from './use-cases';
@Module({
  imports: [HashingModule, ImageStoreModule],
  controllers: [UserController],
  providers: [...UserUseCasesProviders, UserService],
})
export class UserModule {}
