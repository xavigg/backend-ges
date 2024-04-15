import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { JWTPayload } from './interfaces/jwt-payload.interface';
import { ErrorHandler } from 'src/utils/error.handler';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login({ email, password }: LoginDto) {
    const user: User = await this.usersService.findOneByEmail(email);
    await User.comparePassword(password, user);
    const payload: JWTPayload = { sub: user.iduser, email: user.email };
    const token = await this.jwtService.signAsync(payload);
    return {
      token: token,
      //email: user.email,
    };
  }

  async register(registerDto: RegisterDto): Promise<User> {
    return await this.usersService.createUser(registerDto);
  }

  async validateUser({ email, password }: LoginDto): Promise<User> {
    const user: User = await this.usersService.findOneByEmail(email);
    if (!user) {
      ErrorHandler.handleUnauthorizedError('Invalid email')
    }
    await User.comparePassword(password, user);
    return user;
  }
}
