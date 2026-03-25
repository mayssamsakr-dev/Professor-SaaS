import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '@prisma/client';
import { Patch, Param, Delete } from '@nestjs/common';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Controller('subjects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubjectController {

  /*
تعديل مادة
OWNER فقط
*/
@Patch(':id')
@Roles(UserRole.OWNER)
update(

  @Param('id') id: string,

  @Body() dto: UpdateSubjectDto,

  @Req() req: any

) {

  return this.subjectService.update(

    Number(id),

    dto,

    req.user.tenantId

  );

}

/*
حذف مادة
OWNER فقط
*/
@Delete(':id')
@Roles(UserRole.OWNER)
delete(

  @Param('id') id: string,

  @Req() req: any

) {

  return this.subjectService.delete(

    Number(id),

    req.user.tenantId

  );

}

  constructor(private readonly subjectService: SubjectService) {}

  // فقط OWNER يستطيع إنشاء مادة
  @Post()
  @Roles(UserRole.OWNER)
  create(@Body() dto: CreateSubjectDto, @Req() req: any) {
    return this.subjectService.create(dto, req.user.tenantId);
  }

  // OWNER و USER يستطيعان القراءة
  @Get()
  @Roles(UserRole.OWNER, UserRole.USER)
  findAll(@Req() req: any) {
    return this.subjectService.findAll(req.user.tenantId);
  }
}