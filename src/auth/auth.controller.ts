import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { RefreshJwtGuard } from './guards/refresh-jwt/refresh-jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {};

  @Post("register")
  register(@Body() body: { email: string, password: string }): Promise<{ message: string }> {
    return this.authService.registerUser(body.email, body.password);
  }

  @UseGuards(LocalAuthGuard)
  @Post("login")
  login(@Request() req) {
    return this.authService.login(req.user.id, req.user.email);
  }

  @UseGuards(RefreshJwtGuard)
  @Post("refresh")
  refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user.id, req.user.email);
  }
}