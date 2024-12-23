import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUsersDto } from './dto/create-users.dto';
import { UpdateUsersDto } from './dto/update-users.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUsersDto: CreateUsersDto) {
    const userExist = await this.usersRepository.findByEmail(
      createUsersDto.email,
    );

    if (userExist) {
      throw new UnauthorizedException('User exists');
    }

    const user = await this.usersRepository.create(createUsersDto);
    return { id: user.id, email: user.email };
  }

  async findMe(id: number) {
    const user = await this.usersRepository.findMe(id);
    if (!user) throw new UnauthorizedException('User not found');
    return { id: user.id, email: user.email, playlists: user.playlists };
  }

  async findAll() {
    return this.usersRepository.findAll();
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne(id);
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }

  async blockUser(id: number) {
    return this.usersRepository.blockUser(id);
  }

  async unblockUser(id: number) {
    return this.usersRepository.unblockUser(id);
  }

  async update(id: number, updateUsersDto: UpdateUsersDto) {
    return this.usersRepository.update(id, updateUsersDto);
  }

  async remove(id: number) {
    return this.usersRepository.remove(id);
  }
}
