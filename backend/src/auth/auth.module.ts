import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [JwtModule.register({}), UserModule,MailerModule.forRoot({
    transport: {
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: '1cdfa48932d388',
        pass: '9e2bd47f271a60'
      }
    }
  })],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
