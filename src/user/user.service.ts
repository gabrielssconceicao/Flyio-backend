import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BcryptService } from '@/auth/bcrypt.service';

@Injectable()
export class UserService {
  constructor(private readonly bcryptService: BcryptService) {}
  async create(createUserDto: CreateUserDto) {
    const password = await this.bcryptService.hash(createUserDto.password);

    return { password };
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
