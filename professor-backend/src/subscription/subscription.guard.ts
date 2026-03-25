import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../auth/public.decorator';

@Injectable()
export class SubscriptionGuard implements CanActivate {

  constructor(

    private prisma: PrismaService,

    private reflector: Reflector

  ) {}

  async canActivate(
    context: ExecutionContext
  ): Promise<boolean>{

    const request =
      context.switchToHttp().getRequest();

    /*
    السماح للـ activate بدون اشتراك
    */

    const path =
      request.originalUrl;

    if(
      path.startsWith(
        "/subscriptions/activate"
      )
    ){

      return true;

    }

    /*
    السماح للـ public endpoints
    */

    const isPublic =
      this.reflector.getAllAndOverride<boolean>(

        IS_PUBLIC_KEY,

        [
          context.getHandler(),
          context.getClass()
        ]

      );

    if(isPublic){

      return true;

    }

    /*
    التحقق من المستخدم
    */

    const user =
      request.user;

    if(!user){

      throw new ForbiddenException(
        "Unauthorized"
      );

    }

    /*
    التحقق من الاشتراك
    */

    const subscription =
      await this.prisma.subscription.findFirst({

        where:{

          tenantId:
            user.tenantId,

          isActive:true,

          endDate:{
            gt:new Date()
          }

        }

      });

    if(!subscription){

      throw new ForbiddenException(
        "No active subscription"
      );

    }

    return true;

  }

}