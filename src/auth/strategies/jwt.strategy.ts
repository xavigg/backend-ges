import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JWTPayload } from '../interfaces/jwt.interface';
import { Request } from 'express';
import { ErrorHandler } from 'src/shared/error.handler';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest:ExtractJwt.fromExtractors([(request:Request) => {
        let data = request?.cookies["auth-cookie"];
        if(!data){
            return null;
        }
        return data;
      }]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JWTPayload) {
    if(payload === null){
      ErrorHandler.handleUnauthorizedError("Unauthorized");
  }
  return { iduser: payload.sub, email: payload.email };
  }
}