import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
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

  @Put(':id')
@Roles(UserRole.OWNER)
update(

  @Param('id') id: string,

  @Body() dto: CreateServiceTypeDto,

  @Req() req: any

) {

  return this.serviceTypeService.update(

    Number(id),

    dto,

    req.user.tenantId

  );

}


@Delete(':id')
@Roles(UserRole.OWNER)
remove(

  @Param('id') id: string,

  @Req() req: any

) {

  return this.serviceTypeService.remove(

    Number(id),

    req.user.tenantId

  );

}

@Get(':id/used-in-invoice')
@Roles(UserRole.OWNER)
async usedInInvoice(

  @Param('id') id:string,

  @Req() req:any

){

  const used =

    await this.serviceTypeService.isUsedInInvoice(

      Number(id),

      req.user.tenantId

    );

  return { used };

}

}