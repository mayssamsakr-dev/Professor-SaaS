import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateClassGroupDto } from "./dto/create-class-group.dto";
import { UpdateClassGroupDto } from "./dto/update-class-group.dto";

@Injectable()
export class ClassGroupService {

  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: number) {
    return this.prisma.classGroup.findMany({
      where: { tenantId },

      include: {
        universitySubject: {
          include: {
            university: true,
            subject: true
          }
        }
      },

      orderBy: {
        name: "asc"
      }
    });
  }

  async create(dto: CreateClassGroupDto, tenantId: number) {

  const universitySubject = await this.prisma.universitySubject.findFirst({
    where: {
      id: dto.universitySubjectId,
      tenantId,
    },
  });

  if (!universitySubject) {
    throw new BadRequestException(
      "Invalid university subject"
    );
  }

  // تحقق من التكرار قبل الحفظ
  const existing = await this.prisma.classGroup.findFirst({
    where: {
      name: dto.name.trim(),
      universitySubjectId: dto.universitySubjectId,
      tenantId
    }
  });

  if (existing) {
    throw new BadRequestException(
      "Class already exists for this subject"
    );
  }

  return this.prisma.classGroup.create({
    data: {
      name: dto.name.trim(),
      universitySubjectId: dto.universitySubjectId,
      tenantId
    }
  });

}

  async update(id: number, dto: UpdateClassGroupDto, tenantId: number) {

  const existing = await this.prisma.classGroup.findFirst({
    where: {
      id,
      tenantId
    }
  });

  if (!existing) {
    throw new NotFoundException(
      "Class not found"
    );
  }

  // تحقق من التكرار
  if (dto.name) {

    const duplicate =
      await this.prisma.classGroup.findFirst({

        where: {

          id: {
            not: id
          },

          name:
            dto.name.trim(),

          universitySubjectId:
            dto.universitySubjectId
            ?? existing.universitySubjectId,

          tenantId

        }

      });

    if (duplicate) {

      throw new BadRequestException(
        "Class already exists for this subject"
      );

    }

  }

  return this.prisma.classGroup.update({

    where: { id },

    data: {

      ...(dto.name && {
        name: dto.name.trim()
      }),

      ...(dto.universitySubjectId && {
        universitySubjectId:
          dto.universitySubjectId
      })

    }

  });

}

  async remove(id: number, tenantId: number) {

    const existing = await this.prisma.classGroup.findFirst({
      where: {
        id,
        tenantId
      },

      include: {
        teachingSessions: true
      }
    });

    if (!existing) {
      throw new NotFoundException("ClassGroup not found");
    }

    if (existing.teachingSessions.length > 0) {
      throw new BadRequestException(
        "Cannot delete class group because it is used in teaching sessions"
      );
    }

    return this.prisma.classGroup.delete({
      where: { id }
    });
  }

}