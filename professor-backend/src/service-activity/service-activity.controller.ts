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

import { ServiceActivityService } from './service-activity.service';
import { CreateServiceActivityDto } from './dto/create-service-activity.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

import { Patch } from '@nestjs/common';
import { UpdateServiceActivityDto } from './dto/update-service-activity.dto';

@Controller('service-activities')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ServiceActivityController {

  constructor(private readonly serviceActivityService: ServiceActivityService) {}

  @Post()
  @Roles(UserRole.OWNER)
  create(@Body() dto: CreateServiceActivityDto, @Req() req: any) {

    return this.serviceActivityService.create(
      dto,
      req.user.tenantId
    );

  }

  @Get()
  @Roles(UserRole.OWNER, UserRole.USER)
  findAll(@Req() req: any) {

    return this.serviceActivityService.findAll(
      req.user.tenantId
    );

  }

  @Delete(':id')
  @Roles(UserRole.OWNER)
  delete(@Param('id') id: string, @Req() req: any) {

    return this.serviceActivityService.softDelete(
      Number(id),
      req.user.tenantId
    );

  }

  @Patch(':id')
@Roles(UserRole.OWNER)
update(

  @Param('id') id: string,

  @Body() dto: UpdateServiceActivityDto,

  @Req() req: any

) {

  return this.serviceActivityService.update(

    Number(id),

    dto,

    req.user.tenantId

  );

}

}