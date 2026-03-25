import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Req,
  UseGuards
} from '@nestjs/common';

import { TeachingSessionService } from './teaching-session.service';
import { CreateTeachingSessionDto } from './dto/create-teaching-session.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import { Patch } from '@nestjs/common';
import { UpdateTeachingSessionDto } from './dto/update-teaching-session.dto';

@Controller('teaching-sessions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeachingSessionController {

  constructor(private readonly teachingSessionService: TeachingSessionService) {}

  @Post()
  @Roles(UserRole.OWNER)
  create(@Body() dto: CreateTeachingSessionDto, @Req() req: any) {

    return this.teachingSessionService.create(
      dto,
      req.user.tenantId
    );

  }

  @Get()
  @Roles(UserRole.OWNER, UserRole.USER)
  findAll(@Req() req: any) {

    return this.teachingSessionService.findAll(
      req.user.tenantId
    );

  }

  @Delete(':id')
  @Roles(UserRole.OWNER)
  delete(@Param('id') id: string, @Req() req: any) {

    return this.teachingSessionService.softDelete(
      Number(id),
      req.user.tenantId
    );

  }

  @Patch(':id')
@Roles(UserRole.OWNER)
update(

  @Param('id') id: string,

  @Body() dto: UpdateTeachingSessionDto,

  @Req() req: any

) {

  return this.teachingSessionService.update(

    Number(id),

    dto,

    req.user.tenantId

  );

}

}