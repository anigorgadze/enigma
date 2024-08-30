import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from 'src/users/users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from './role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) { }

  async login(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    if(user.blocked){
      throw new UnauthorizedException('sorry, დაბლოკილი ხარ')
    }

    const payload = { sub: user.id, email: user.email, role: user.isAdmin ? Role.Admin : Role.User };

    const isPasswordCorrect = bcrypt.compareSync(pass, user.password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedException();
    }

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

}