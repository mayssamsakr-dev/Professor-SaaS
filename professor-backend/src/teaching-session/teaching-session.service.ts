import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseTenantService } from '../common/base-tenant.service';
import { CreateTeachingSessionDto } from './dto/create-teaching-session.dto';

@Injectable()
export class TeachingSessionService extends BaseTenantService {

  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async create(dto: CreateTeachingSessionDto, tenantId: number) {

  const universitySubject = await this.prisma.universitySubject.findFirst({
    where: {
      id: dto.universitySubjectId,
      tenantId,
    },
  });

  if (!universitySubject) {
    throw new BadRequestException('UniversitySubject not found');
  }

  // تحقق أن الصف مرتبط بنفس universitySubject
  const classGroup = await this.prisma.classGroup.findFirst({
    where: {
      id: dto.classGroupId,
      universitySubjectId: dto.universitySubjectId,
      tenantId
    }
  });

  if (!classGroup) {
    throw new BadRequestException('Invalid class group for selected subject');
  }

  const unitRate = Number(universitySubject.ratePerSession);

  const quantity = Number(dto.quantity);

  const totalAmount = quantity * unitRate;

  return this.prisma.teachingSession.create({

    data: {

      date: new Date(dto.date),

      quantity,

      unitRate,

      totalAmount,

      universitySubjectId: dto.universitySubjectId,

      classGroupId: dto.classGroupId,

      tenantId,

    },

    include: {

      universitySubject: {

        include: {

          university: true,

          subject: true,

        },

      },

      classGroup: true

    },

  });

}

  async findAll(tenantId: number) {

    return this.prisma.teachingSession.findMany({
      where: {
        tenantId,
        deletedAt: null
      },
      include: {

  universitySubject: {

    include: {

      university: true,

      subject: true,

    },

  },

  classGroup: true,

  invoice: true,

},
      orderBy: {
        date: 'desc',
      },
    });

  }

  async softDelete(id: number, tenantId: number) {

    const session = await this.prisma.teachingSession.findFirst({
      where: {
        id,
        tenantId,
        deletedAt: null
      }
    });

    if (!session) {
      throw new BadRequestException('Teaching session not found');
    }

    if (session.invoiceId) {
      throw new BadRequestException('Cannot delete session already invoiced');
    }

    return this.prisma.teachingSession.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });

  }
  /*
تعديل session
مسموح فقط إذا غير مرتبط بفاتورة
*/
async update(
  id: number,
  dto: any,
  tenantId: number
) {

  const session =
    await this.prisma.teachingSession.findFirst({

      where: {

        id,

        tenantId,

        deletedAt: null

      }

    });

  if (!session) {

    throw new BadRequestException(

      "Session not found"

    );

  }

  if (session.invoiceId) {

    throw new BadRequestException(

      "Cannot edit session already invoiced"

    );

  }

  const universitySubject =
    await this.prisma.universitySubject.findFirst({

      where: {

        id: dto.universitySubjectId,

        tenantId

      }

    });

  if (!universitySubject) {

    throw new BadRequestException(

      "UniversitySubject not found"

    );

  }

  // تحقق classGroup
  const classGroup =
    await this.prisma.classGroup.findFirst({

      where: {

        id: dto.classGroupId,

        universitySubjectId: dto.universitySubjectId,

        tenantId

      }

    });

  if (!classGroup) {

    throw new BadRequestException(

      "Invalid class group for selected subject"

    );

  }

  const unitRate =
    Number(universitySubject.ratePerSession);

  const quantity =
    Number(dto.quantity);

  const totalAmount =
    quantity * unitRate;

  return this.prisma.teachingSession.update({

    where: {

      id

    },

    data: {

      date: new Date(dto.date),

      quantity,

      unitRate,

      totalAmount,

      universitySubjectId:
        dto.universitySubjectId,

      classGroupId:
        dto.classGroupId

    },

    include: {

      universitySubject: {

        include: {

          university: true,

          subject: true

        }

      },

      classGroup: true

    }

  });

}

}
