import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { HashingService } from '@/hash/hashing.service';
import { PrismaService } from '@/prisma/prisma.service';
import { UserMapper } from './user.mapper';
import { UserEntity } from './entities/user.entity';

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

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { email, name, username, bio, password } = createUserDto;

    const isTaken = await this.isUserOrEmailTaken({
      username,
      email,
    });

    if (isTaken) {
      throw new ConflictException(
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
      select: UserMapper.defaultFields,
    });

    return user;
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: UserMapper.findUserFields,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return { user };
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
