import { Controller, Post, Get, Body } from '@nestjs/common';
import { PlanService } from './plan.service';

@Controller('plans')
export class PlanController {

  constructor(private readonly planService: PlanService) {}

  @Post()
  create(@Body() body: any) {
    return this.planService.create(body);
  }

  @Get()
  findAll() {
    return this.planService.findAll();
  }

}