import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { BcryptService } from '@/auth/bcrypt.service';
import { PrismaService } from '@/prisma/prisma.service';

type CheckUserParams = {
  username?: string;
  email?: string;
};

@Injectable()
export class UserService {
  constructor(
    private readonly bcryptService: BcryptService,
    private readonly prisma: PrismaService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    if (
      await this.isUserOrEmailTaken({
        username: createUserDto.username,
        email: createUserDto.email,
      })
    ) {
      throw new BadRequestException({
        d: 'User or email already taken',
      });
    }
    const { email, name, username, bio, password } = createUserDto;
    const hashedPassword = await this.bcryptService.hash(password);

    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        username,
        bio,
        password: hashedPassword,
      },
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
