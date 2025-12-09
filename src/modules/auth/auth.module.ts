import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserModule } from '../admin/system/user/user.module';
import { TokenService } from './services/token.service';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PermissionGuard } from './guards/permissions.guard';

@Module({
  imports: [
    PassportModule.register({ 
      defaultStrategy: 'jwt', 
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService): JwtModuleOptions => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<any>('JWT_EXPIRES_IN') },
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  providers: [
    AuthService,
    TokenService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    }
  ],
  controllers: [AuthController]
})
export class AuthModule {}
