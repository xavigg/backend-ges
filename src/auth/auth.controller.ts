import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LocalAuthGuard } from './guards/local.guard';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'express';
import RequestWithUser from './interfaces/requestWithUser.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  /*
  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@AuthRequest() authRequest: { dataLogin: LoginDto; user: User }) {
    return this.authService.logIn(authRequest.user);
  }*/

  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async logIn(@Req() resquet: RequestWithUser, @Res() response: Response) {
    const { user } = resquet;
    const cookie = this.authService.signJwtAccessToken(user);
    response.setHeader('Set-Cookie', await cookie);
    user.password = undefined;
    return response.send(user);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('/refreshtoken')
  async refresh_token(@Req() resquet: RequestWithUser, @Res() response: Response) {
    const { user } = resquet;
    const cookie = this.authService.signJwtRefreshToken(user);
    response.setHeader('Set-Cookie', await cookie);
    user.password = undefined;
    return response.send(user);
  }

  @Public()
  @Post('register')
  register(@Body() registerDTO: RegisterDto) {
    return this.authService.register(registerDTO);
  }
}
