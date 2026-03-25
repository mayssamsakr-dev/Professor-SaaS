import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // =========================
  // LOGIN
  // =========================
  async login(email: string, password: string) {

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(
      password,
      user.passwordHash,
    );

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      tenantId: user.tenantId,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }

  // =========================
  // REGISTER (Tenant + Owner)
  // =========================
  async register(dto: RegisterDto) {

    return this.prisma.$transaction(async (tx) => {

      /*
      تحقق من email
      */

      const existingUser = await tx.user.findUnique({
        where: { email: dto.email },
      });

      if (existingUser) {
        throw new BadRequestException('Email already in use');
      }

      /*
      إنشاء tenant
      */

      const tenant = await tx.tenant.create({
        data: {
          legalName: dto.legalName,
          email: dto.email,
          baseCurrencyId: dto.baseCurrencyId
        },
      });

      /*
      hash password
      */

      const passwordHash = await bcrypt.hash(dto.password, 10);

      /*
      إنشاء owner
      */

      await tx.user.create({
        data: {
          email: dto.email,
          passwordHash,
          fullName: dto.fullName,
          role: UserRole.OWNER,
          tenantId: tenant.id,
        },
      });

      /*
      لا نقوم بتسجيل الدخول تلقائياً
      */

      return {
        message: "Account created"
      };

    });

  }

}