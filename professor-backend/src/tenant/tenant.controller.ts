import { Controller, Get, Post, Body } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { Public } from '../auth/public.decorator';

import { Req, Patch, Param } from '@nestjs/common';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

@Public()
@Post()
create(@Body() dto: CreateTenantDto) {
  return this.tenantService.create(dto);
}

  @Get()
  findAll() {
    return this.tenantService.findAll();
  }

  @Get("me")
getMe(@Req() req:any){

return this.tenantService.findOne(

req.user.tenantId

);

}

@Patch("me")
updateMe(

@Req() req:any,

@Body() dto:UpdateTenantDto

){

return this.tenantService.update(

req.user.tenantId,

dto

);

}
}