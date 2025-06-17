import { HashingService } from '@/hash/hashing.service';
import { UserImageStoreUseCase } from '@/image-store/use-cases';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MeUseCase {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly hashing: HashingService,
    protected readonly imageStore: UserImageStoreUseCase,
  ) {}
}
