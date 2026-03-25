import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { TestController } from './test.controller';
import { TenantModule } from './tenant/tenant.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { UniversityModule } from './university/university.module';
import { PrismaModule } from './prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { SubjectModule } from './subject/subject.module';
import { UniversitySubjectModule } from './university-subject/university-subject.module';
import { TeachingSessionModule } from './teaching-session/teaching-session.module';
import { ServiceTypeModule } from './service-type/service-type.module';
import { ServiceActivityModule } from './service-activity/service-activity.module';
import { InvoiceModule } from './invoice/invoice.module';
import { PaymentModule } from './payment/payment.module';
import { SubscriptionGuard } from './subscription/subscription.guard';
import { PlanModule } from './plan/plan.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ReportsModule } from './reports/reports.module';
import { CurrencyModule } from "./currency/currency.module";



@Module({
  imports: [
    ThrottlerModule.forRoot({
  throttlers: [
    {
      ttl: 60000,
      limit: 100,
    },
  ],
}),
    PrismaModule,
    TenantModule,
    UserModule,
    AuthModule,
    UniversityModule,
    SubjectModule,
    UniversitySubjectModule,
    TeachingSessionModule,
    ServiceTypeModule,
    ServiceActivityModule,
    InvoiceModule,
    PaymentModule,
    PlanModule,
    SubscriptionModule,
    ReportsModule,
    CurrencyModule,
  ],
  controllers: [TestController],
providers: [
  {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  },
  {
    provide: APP_GUARD,
    useClass: RolesGuard,
  },
],
})
export class AppModule {}