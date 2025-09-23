import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async pingDb(timeoutMs = 800): Promise<void> {
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('db-timeout')), timeoutMs),
    );

    await Promise.race([this.prisma.$queryRaw`SELECT 1`, timeout]);
  }
}
