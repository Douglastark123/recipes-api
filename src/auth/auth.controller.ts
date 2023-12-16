import { Controller, Get, Post, Request, Res, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('validate')
  @UseGuards(JwtAuthGuard)
  public async validateToken(@Request() req: any) {
    return { message: 'Token is valid', user: req.user };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  public async login(
    @Request() req: any,
    @Res({ passthrough: true }) response: Response,
  ) {
    const loginObj = await this.authService.login(req.user);
    response.cookie('jwt', loginObj.access_token);
    return loginObj;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Res() response: Response) {
    response.clearCookie('jwt');
    return;
  }
}
