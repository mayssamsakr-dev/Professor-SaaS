import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseTenantService } from '../common/base-tenant.service';
import { CreateUniversitySubjectDto } from './dto/create-university-subject.dto';
import { UpdateUniversitySubjectDto } from './dto/update-university-subject.dto';

@Injectable()
export class UniversitySubjectService extends BaseTenantService {

  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async create(
    data: CreateUniversitySubjectDto,
    tenantId: number
  ) {

    /*
    تحقق الجامعة
    */

    const university =
      await this.prisma.university.findFirst({

        where:{

          id: data.universityId,

          tenantId

        }

      });

    if(!university)

      throw new BadRequestException(
        'University not found'
      );

    /*
    تحقق المادة
    */

    const subject =
      await this.prisma.subject.findFirst({

        where:{

          id: data.subjectId,

          tenantId

        }

      });

    if(!subject)

      throw new BadRequestException(
        'Subject not found'
      );

    /*
    منع التكرار
    */

    const existing =
      await this.prisma.universitySubject.findFirst({

        where:{

          universityId: data.universityId,

          subjectId: data.subjectId,

          tenantId

        }

      });

    if(existing)

      throw new BadRequestException(
        'Subject already linked to this university'
      );

    /*
    العملة = نفس عملة الجامعة
    */

    return this.tenantCreate(

      this.prisma.universitySubject,

      tenantId,

      {

        universityId:
          data.universityId,

        subjectId:
          data.subjectId,

        ratePerSession:
          data.ratePerSession,

        currencyId:
          university.defaultCurrencyId

      }

    );

  }

  async findAll(
    tenantId:number
  ){

    return this.tenantFindMany(

      this.prisma.universitySubject,

      tenantId,

      {

        include:{

          university:{
            select:{
              id:true,
              name:true
            }
          },

          subject:{
            select:{
              id:true,
              name:true
            }
          },

          currency:true

        },

        orderBy:{
          id:'desc'
        }

      }

    );

  }

  async findByUniversity(
    universityId:number,
    tenantId:number
  ){

    return this.tenantFindMany(

      this.prisma.universitySubject,

      tenantId,

      {

        where:{
          universityId
        },

        include:{

          subject:{
            select:{
              id:true,
              name:true
            }
          },

          currency:true

        }

      }

    );

  }

  /*
  تعديل السعر فقط
  */

  async update(

    id:number,

    dto:UpdateUniversitySubjectDto,

    tenantId:number

  ){

    const record =
      await this.prisma.universitySubject.findFirst({

        where:{
          id,
          tenantId
        }

      });

    if(!record)

      throw new BadRequestException(
        "Record not found"
      );

    return this.prisma.universitySubject.update({

      where:{ id },

      data:{

        ratePerSession:
          dto.ratePerSession

      }

    });

  }

  /*
  حذف
  */

  async remove(

    id:number,

    tenantId:number

  ){

    const used =
      await this.prisma.teachingSession.findFirst({

        where:{

          universitySubjectId:id,

          tenantId

        }

      });

    if(used)

      throw new BadRequestException(

        "Cannot delete, teaching sessions exist"

      );

    return this.prisma.universitySubject.delete({

      where:{ id }

    });

  }

}