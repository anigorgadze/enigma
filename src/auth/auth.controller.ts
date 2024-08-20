import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AuthGuard } from './auth.guard';
import { Public } from './public.decorator';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Roles } from './roles.decorator';
import { Admin } from 'typeorm';
import { Role } from './role.enum';
import { RolesGuard } from './roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  @Public()
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.body.email,req.body.password);
  }

  @Roles(Role.User)
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

}
