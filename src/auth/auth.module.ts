import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "src/users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "./guards/auth.guard";
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";

const jwtFactory = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    global: true,
    secret: configService.get<string>('JWT_SECRET'),
    signOptions: {
      expiresIn: configService.get('JWT_EXP_H'),
    },
  }),
  inject: [ConfigService],
};

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync(jwtFactory),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, 
    {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  },
  
],
exports: [AuthService],
})
export class AuthModule {}
