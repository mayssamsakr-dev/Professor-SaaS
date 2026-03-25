import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards
} from '@nestjs/common';

import { ServiceTypeService } from './service-type.service';
import { CreateServiceTypeDto } from './dto/create-service-type.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('service-types')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ServiceTypeController {

  constructor(private readonly serviceTypeService: ServiceTypeService) {}

  @Post()
  @Roles(UserRole.OWNER)
  create(@Body() dto: CreateServiceTypeDto, @Req() req: any) {

    return this.serviceTypeService.create(
      dto,
      req.user.tenantId
    );

  }

  @Get()
  @Roles(UserRole.OWNER, UserRole.USER)
  findAll(@Req() req: any) {

    return this.serviceTypeService.findAll(
      req.user.tenantId
    );

  }

}