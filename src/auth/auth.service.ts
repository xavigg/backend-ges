import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { JWTPayload } from './interfaces/jwt.interface';
import { ErrorHandler } from 'src/shared/error.handler';
import { ExecutionResult } from 'src/shared/interfaces/ExecutionResult.interface';

@Injectable()
export class AuthService {
  configService: any;
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signJwtAccessToken(user: User): Promise<string> {
    const payload: JWTPayload = { sub: user.userId, email: user.email };
    try {
      const authToken = await this.jwtService.signAsync(payload, {
        expiresIn: process.env.JWT_EXP_H,
      });
      return authToken;
    } catch (error) {
      throw new ErrorHandler.createSignatureError(error);
    }
  }

  public async signJwtRefreshToken(user: User): Promise<string> {
    const payload: JWTPayload = { sub: user.userId, email: user.email };
    try {
      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_EXP_D,
      });
      return refreshToken;
    } catch (error) {
      throw new ErrorHandler.createSignatureError(error);
    }
  }

  async register(registerDto: RegisterDto): Promise<ExecutionResult> {
    return await this.usersService.createUser(registerDto);
  }

  async validateUser({ email, password }: LoginDto): Promise<User> {
    const user: User = await this.usersService.findOneByEmail(email);
    await User.comparePassword(password, user);
    return user;
  }
}
