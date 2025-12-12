import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'dev-secret-change-in-production',
    });
  }

  async validate(payload: any) {
    // Walidacja payload - sprawdź czy zawiera wymagane pola
    if (!payload.sub || !payload.email) {
      throw new Error('Invalid JWT payload: missing required fields');
    }

    return { userId: payload.sub, email: payload.email };
  }
}
