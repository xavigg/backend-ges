import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthRequest = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const dataLogin = request.body;
    const user = request.user;
    return { dataLogin, user };
  },
);
