import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/guards/accessToken.guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signIn')
  signIn(@Body() data: CreateAuthDto) {
    return this.authService.signIN(data)
  }

  @Post('forget-password')
  async forgetPassword(@Body() data: CreateAuthDto) {
    return this.authService.forgetPassword(data.email)
  }

  @Post('reset-password/:token')
  async resetPassword(@Body() data: CreateAuthDto, @Param('token') token: string) {
    return this.authService.resetPassword(data.password, token)
  }
  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@Req() req: Request) {
    if (!req.user) {
      throw new UnauthorizedException('User not authenticated');
    }
    this.authService.logout(req.user['sub']);
  }
}
