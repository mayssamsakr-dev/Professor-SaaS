import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // نستخرج التوكن من Authorization header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration: false, // لا نسمح بتوكن منتهي الصلاحية

      secretOrKey: 'SUPER_SECRET_KEY_CHANGE_LATER', // نفس المفتاح في AuthModule
    });
  }

  async validate(payload: any) {
    // هذا الذي سيصبح req.user
    return {
      userId: payload.sub,
      tenantId: payload.tenantId,
      role: payload.role,
    };
  }
}