import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {

  async onModuleInit() {
    await this.$connect();
  }

  async withTenant<T>(
    tenantId: number,
    callback: (tx: Prisma.TransactionClient) => Promise<T>,
  ): Promise<T> {

    return this.$transaction(async (tx) => {

      await tx.$executeRawUnsafe(
        `SET LOCAL app.tenant_id = '${tenantId}'`
      );

      return callback(tx);

    });
  }
}