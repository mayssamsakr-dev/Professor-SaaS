import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { BaseTenantService } from '../common/base-tenant.service';

@Injectable()
export class UserService extends BaseTenantService {

  constructor(prisma: PrismaService) {
    super(prisma);
  }

async create(data: CreateUserDto, tenantId: number) {

  const tenant = await this.prisma.tenant.findUnique({
    where: { id: tenantId },
  });

  if (!tenant) {
    throw new BadRequestException('Tenant not found');
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  return this.prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      fullName: data.fullName,
      role: 'USER', // دائمًا USER
      tenantId,
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      isActive: true,
      tenantId: true,
      createdAt: true,
    },
  });
}

  async findAll(tenantId: number) {

    return this.tenantFindMany(
      this.prisma.user,
      tenantId,
      {
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          isActive: true,
          tenantId: true,
          createdAt: true,
          tenant: {
            select: {
              id: true,
              legalName: true,
            },
          },
        },
      }
    );
  }
}