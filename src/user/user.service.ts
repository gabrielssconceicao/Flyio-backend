import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { HashingService } from '@/hash/hashing.service';
import { PrismaService } from '@/prisma/prisma.service';
import { UserMapper } from './user.mapper';

type CheckUserParams = {
  username?: string;
  email?: string;
};

@Injectable()
export class UserService {
  constructor(
    private readonly hashing: HashingService,
    private readonly prisma: PrismaService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { email, name, username, bio, password } = createUserDto;

    const isTaken = await this.isUserOrEmailTaken({
      username,
      email,
    });

    if (isTaken) {
      throw new BadRequestException(
        'User with this email or username already exists',
      );
    }
    const hashedPassword = await this.hashing.hash(password);

    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        username,
        bio,
        password: hashedPassword,
      },
      select: UserMapper.createUser,
    });

    return { user };
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  private async isUserOrEmailTaken(params: CheckUserParams): Promise<boolean> {
    const conditions: any[] = [];

    if (params.username) {
      conditions.push({ username: params.username });
    }

    if (params.email) {
      conditions.push({ email: params.email });
    }

    if (conditions.length === 0) {
      return false;
    }

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: conditions,
      },
    });

    return !!existingUser;
  }
}
