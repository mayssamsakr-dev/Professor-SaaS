import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseTenantService } from '../common/base-tenant.service';
import { CreateSubjectDto } from './dto/create-subject.dto';

@Injectable()
export class SubjectService extends BaseTenantService {

  constructor(prisma: PrismaService) {
    super(prisma);
  }

  //////////////////////////////////////////////////////////////////////////////////
  /*
تعديل مادة
*/
/*
تعديل مادة
*/
async update(
  id: number,
  data: any,
  tenantId: number
) {

  /*
  تحقق عدم تكرار الاسم
  */
  const existing = await this.prisma.subject.findFirst({

    where: {

      name: data.name,

      tenantId,

      NOT: {

        id

      }

    }

  });

  if (existing) {

    throw new BadRequestException(

      "Subject name already exists"

    );

  }

  /*
  تحديث
  */
  return this.prisma.subject.update({

    where: {

      id,

      tenantId

    },

    data: {

      name: data.name,

      description: data.description

    }

  });

}

/*
حذف مادة
*/
async delete(
  id: number,
  tenantId: number
) {

  /*
  تحقق من وجود sessions مرتبطة
  */
  const used = await this.prisma.teachingSession.findFirst({

    where: {

      universitySubject: {

        subjectId: id

      },

      tenantId

    }

  });

  if (used) {

    throw new BadRequestException(

      "Cannot delete subject used in teaching sessions"

    );

  }

  return this.prisma.subject.delete({

    where: {

      id,

      tenantId

    }

  });

}
  //////////////////////////////////////////////////////////////////////////////////

async create(data: CreateSubjectDto, tenantId: number) {

  const existing = await this.prisma.subject.findFirst({
    where: {
      name: data.name,
      tenantId,
    },
  });

  if (existing) {
    throw new BadRequestException('Subject name already exists for this tenant');
  }

  return this.tenantCreate(
    this.prisma.subject,
    tenantId,
    {
      name: data.name,
      description: data.description,
    }
  );
}

  async findAll(tenantId: number) {

    return this.tenantFindMany(
      this.prisma.subject,
      tenantId,
      {
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          name: true,
          description: true,
          tenantId: true,
          createdAt: true,
        },
      },
    );
  }
}