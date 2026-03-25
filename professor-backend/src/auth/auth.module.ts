import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtStrategy } from './jwt-strategy.service'; // الاسم الصحيح للكلاس

@Module({
  imports: [
    PrismaModule, // يسمح باستخدام PrismaService داخل AuthService
    JwtModule.register({
      secret: 'SUPER_SECRET_KEY_CHANGE_LATER', // نفس المفتاح في strategy
      signOptions: {
        expiresIn: '1d', // مدة صلاحية التوكن
      },
    }),
  ],
  controllers: [
    AuthController, // مسؤول عن /auth/login
  ],
  providers: [
    AuthService, // منطق تسجيل الدخول
    JwtStrategy, // استراتيجية التحقق من JWT
  ],
  exports: [
    AuthService,
    JwtModule,
  ],
})
export class AuthModule {}