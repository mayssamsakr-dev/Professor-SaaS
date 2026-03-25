import { Controller, Get, Post, Body } from '@nestjs/common';
import { TenantService } from './tenant/tenant.service';

@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post()
  create(
    @Body() body: {
      legalName: string;
      email: string;
      baseCurrencyId: number;
    },
  ) { 
    return this.tenantService.create(body);
  }

  @Get()
  findAll() {
    return this.tenantService.findAll();
  }
}