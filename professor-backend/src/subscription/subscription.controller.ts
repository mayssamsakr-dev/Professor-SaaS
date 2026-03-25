import {
  Controller,
  Post,
  Get,
  Req,
  Body
} from '@nestjs/common';

import { SubscriptionService } from './subscription.service';

import { Public } from '../auth/public.decorator';

@Controller('subscriptions')
export class SubscriptionController {

  constructor(
    private readonly subscriptionService: SubscriptionService
  ) {}

  /*
  إنشاء subscription (admin أو seed)
  */
  @Post()
  create(@Body() body: any) {

    return this.subscriptionService.create(body);

  }

  /*
  عرض جميع الاشتراكات
  */
  @Get()
  findAll() {

    return this.subscriptionService.findAll();

  }

  /*
  الاشتراك الحالي للمستخدم
  */
  @Get('me')
  getMySubscription(@Req() req: any) {

    return this.subscriptionService.getActive(

      req.user.tenantId

    );

  }

  /*
  تفعيل الاشتراك للمستخدم الجديد
  يجب أن يكون Public
  */
  @Post('activate')
  activate(@Req() req: any) {

    return this.subscriptionService.activate(

      req.user.tenantId

    );

  }

}