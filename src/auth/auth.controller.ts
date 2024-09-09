import { Controller, Get, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('login')
  async login(@Request() req) {
    console.log(req);
    return this.authService.login(req.body.email, req.body.password);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
