import { PrismaService } from '@/prisma/prisma.service';

export abstract class UseCase<T, R> {
  constructor(protected readonly prisma: PrismaService) {}

  abstract execute(params: T): Promise<R>;
}
