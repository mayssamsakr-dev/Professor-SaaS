import { Module } from '@nestjs/common';
import { ServiceActivityService } from './service-activity.service';
import { ServiceActivityController } from './service-activity.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ServiceActivityService],
  controllers: [ServiceActivityController],
})
export class ServiceActivityModule {}