import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { HashingModule } from '@/hash/hashing.module';

@Module({
  imports: [HashingModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
