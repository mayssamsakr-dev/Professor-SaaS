import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';

import { UniversitySubjectService } from './university-subject.service';
import { CreateUniversitySubjectDto } from './dto/create-university-subject.dto';
import { UpdateUniversitySubjectDto } from './dto/update-university-subject.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('university-subjects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UniversitySubjectController {

  constructor(
    private readonly universitySubjectService: UniversitySubjectService,
  ) {}

  // إنشاء مادة داخل جامعة
  @Post()
  @Roles(UserRole.OWNER)
  create(
    @Body() dto: CreateUniversitySubjectDto,
    @Req() req: any,
  ) {
    return this.universitySubjectService.create(
      dto,
      req.user.tenantId,
    );
  }

  // عرض جميع المواد المرتبطة بالجامعات
  @Get()
  @Roles(UserRole.OWNER, UserRole.USER)
  findAll(@Req() req: any) {
    return this.universitySubjectService.findAll(
      req.user.tenantId,
    );
  }

  // عرض مواد جامعة محددة
  @Get('/university/:id')
  @Roles(UserRole.OWNER, UserRole.USER)
  findByUniversity(
    @Param('id') universityId: string,
    @Req() req: any,
  ) {
    return this.universitySubjectService.findByUniversity(
      Number(universityId),
      req.user.tenantId,
    );
  }

  // تعديل السعر
  @Patch(':id')
  @Roles(UserRole.OWNER)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUniversitySubjectDto,
    @Req() req: any,
  ) {
    return this.universitySubjectService.update(
      Number(id),
      dto,
      req.user.tenantId,
    );
  }

  // حذف
  @Delete(':id')
  @Roles(UserRole.OWNER)
  remove(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    return this.universitySubjectService.remove(
      Number(id),
      req.user.tenantId,
    );
  }

}