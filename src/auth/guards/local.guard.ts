import {
  BadRequestException,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { validateOrReject } from 'class-validator';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<any> {

    const request = context.switchToHttp().getRequest();
    const user = new LoginDto();

    user.email = request.body.email;
    user.password = request.body.password;

    try {
      await validateOrReject(user);
    } catch (error) {
      throw new BadRequestException(
        error.flatMap((eachError) => Object.values(eachError.constraints)),
      );
    }
    return await super.canActivate(context);
  }
}
