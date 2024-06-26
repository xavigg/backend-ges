import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable, Logger } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/login.dto';
import { ErrorHandler } from 'src/shared/error.handler';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<User> {
    const user = await this.authService.validateUser({
      email,
      password,
    } as LoginDto);

    if (!user) {
      ErrorHandler.handleUnauthorizedError('Invalid email or password');
    }

    return user;
  }
}
