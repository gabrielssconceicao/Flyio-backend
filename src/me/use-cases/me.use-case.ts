import { UseCase } from '@/common/utils/use-case';
import { Injectable } from '@nestjs/common';
import { HashingService } from '@/hash/hashing.service';
import { UserImageStoreUseCase } from '@/image-store/use-cases';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export abstract class MeUseCase<P, R> extends UseCase<P, R> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly hashing: HashingService,
    protected readonly imageStore: UserImageStoreUseCase,
  ) {
    super(prisma);
  }
}
