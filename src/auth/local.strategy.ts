import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService ,
    private moduleRef: ModuleRef) {
    super(
        {
            passReqToCallback: true,
            emailField: 'email',
            passwordField: 'password',
          }
    );
  }


async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.login(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}