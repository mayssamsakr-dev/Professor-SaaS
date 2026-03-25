import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService], // تسجيل الخدمة
  exports: [PrismaService],   // تصديرها لتُستخدم في Modules أخرى
})
export class PrismaModule {}