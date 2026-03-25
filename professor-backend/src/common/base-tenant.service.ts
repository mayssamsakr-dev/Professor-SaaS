import { PrismaService } from '../prisma/prisma.service';

export abstract class BaseTenantService {

  protected constructor(
    protected readonly prisma: PrismaService,
  ) {}

  protected ensureTenant(tenantId: number) {
    if (!tenantId) {
      throw new Error('TenantId is required for multi-tenant operation');
    }
  }

  protected tenantFindMany(
    model: any,
    tenantId: number,
    args: any,
  ) {
    this.ensureTenant(tenantId);

    return model.findMany({
      ...args,
      where: {
        ...(args?.where || {}),
        tenantId,
      },
    });
  }

  protected tenantCreate(
    model: any,
    tenantId: number,
    data: any,
  ) {
    this.ensureTenant(tenantId);

    return model.create({
      data: {
        ...data,
        tenantId,
      },
    });
  }

  protected tenantUpdate(
    model: any,
    tenantId: number,
    args: any,
  ) {
    this.ensureTenant(tenantId);

    return model.update({
      ...args,
      where: {
        ...(args?.where || {}),
        tenantId,
      },
    });
  }

  protected tenantDelete(
    model: any,
    tenantId: number,
    args: any,
  ) {
    this.ensureTenant(tenantId);

    return model.delete({
      ...args,
      where: {
        ...(args?.where || {}),
        tenantId,
      },
    });
  }
}