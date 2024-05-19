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
import RequestWithUser from './interfaces/requestWithUser.interface';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

// Swagger
@ApiTags('Auth')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
// Controller
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ description: 'User logged in' })
  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async logIn(
    @Req() resquet: RequestWithUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user } = resquet;
    const token = await this.authService.signJwtAccessToken(user);
    response.cookie('auth-cookie', token, {
      secure: false,
      httpOnly: true,
    });
    return { id: user.userId, email: user.email, message: 'User logged in' };
  }

  @Post('tokenVerify')
  @UseGuards(JwtAuthGuard)
  async verificarToken(@Req() req) {
    return { isValid: true };
  }

  @ApiOperation({ summary: 'Refresh Token' })
  @ApiOkResponse({ description: 'Refreshed Token' })
  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('/refreshtoken')
  async refresh_token(
    @Req() resquet: RequestWithUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user } = resquet;
    const token = this.authService.signJwtRefreshToken(user);
    response.cookie('auth-cookie', token, {
      secure: false,
      httpOnly: true,
    });
    return {
      userId: user.userId,
      email: user.email,
      message: 'User logged in',
    };
  }

  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({ description: 'User Created' })
  @ApiBadRequestResponse({ description: 'Email already exists' })
  @ApiBody({ type: RegisterDto })
  @Public()
  @Post('register')
  register(@Body() registerDTO: RegisterDto) {
    return this.authService.register(registerDTO);
  }
}
