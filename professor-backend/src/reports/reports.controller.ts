import { Controller, Get, Req, UseGuards, Query } from '@nestjs/common';

import { ReportsService } from './reports.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SubscriptionGuard } from '../subscription/subscription.guard';

@Controller('reports')
@UseGuards(JwtAuthGuard, SubscriptionGuard)
export class ReportsController {

  constructor(private reportsService: ReportsService) {}

  @Get('summary')
  summary(@Req() req: any, @Query() query: any) {

    return this.reportsService.revenueSummary(
      req.user.tenantId,
      query.dateFrom,
      query.dateTo
    );

  }

  @Get('by-university')
  byUniversity(@Req() req: any, @Query() query: any) {

    return this.reportsService.revenueByUniversity(
      req.user.tenantId,
      query.dateFrom,
      query.dateTo
    );

  }

  @Get('monthly')
  monthly(@Req() req: any, @Query() query: any) {

    return this.reportsService.monthlyRevenue(
      req.user.tenantId,
      query.dateFrom,
      query.dateTo
    );

  }

}