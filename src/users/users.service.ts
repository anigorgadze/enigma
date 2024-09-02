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
    return this.usersRepository.create(createUsersDto);
  }

  async findUserById(id: number) {
    return await this.usersRepository.findOne(id);
  }

  async findByEmail(email: string) {
    return await this.usersRepository.findByEmail(email);
  }

  async blockUser(id: number) {
    return this.usersRepository.blockUser(id);
  }

  async unblockUser(id: number) {
    return this.usersRepository.unblockUser(id);
  }

  findAll() {
    return this.usersRepository.findAll();
  }

  findOne(id: number) {
    return this.usersRepository.findOne(id);
  }

  update(id: number, updateUsersDto: UpdateUsersDto) {
    return this.usersRepository.update(id, updateUsersDto);
  }

  remove(id: number) {
    return this.usersRepository.remove(id);
  }
}
