import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import {
  JWTPayload,
  signJwtAccessTokenResponse,
  signJwtRefreshTokenResponse,
} from './interfaces/jwt.interface';
import { ErrorHandler } from 'src/utils/error.handler';

@Injectable()
export class AuthService {
  configService: any;
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async logIn(user: User): Promise<string> {
    const payload: JWTPayload = { sub: user.iduser, email: user.email };
    const access_token = await this.jwtService.signAsync(payload);
    return `Authentication=${access_token}; HttpOnly; Path=/; Max-Age=${process.env.JWT_EXP_H}`;
  }

  async signJwtAccessToken(user: User): Promise<string> {
    const payload: JWTPayload = { sub: user.iduser, email: user.email };
    try {
      const access_token = await this.jwtService.signAsync(payload, {
        expiresIn: process.env.JWT_EXP_H,
      });
      return `Authentication=${access_token}; HttpOnly; Path=/; Max-Age=${process.env.JWT_EXP_H}`;
    } catch (error) {
      throw new ErrorHandler.createSignatureError(error);
    }
  }

  public async signJwtRefreshToken(user: User): Promise<string> {
    const payload: JWTPayload = { sub: user.iduser, email: user.email };
    try {
      const refresh_token = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_EXP_D,
      });
      return `Authentication=${refresh_token}; HttpOnly; Path=/; Max-Age=${process.env.JWT_EXP_D}`;
    } catch (error) {
      throw new ErrorHandler.createSignatureError(error);
    }
  }

  async register(registerDto: RegisterDto): Promise<User> {
    return await this.usersService.createUser(registerDto);
  }

  async validateUser({ email, password }: LoginDto): Promise<User> {
    const user: User = await this.usersService.findOneByEmail(email);
    await User.comparePassword(password, user);
    return user;
  }
}
