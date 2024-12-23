import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { CreateUsersDto } from './dto/create-users.dto';
import { UpdateUsersDto } from './dto/update-users.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async create(createUsersDto: CreateUsersDto) {
    const newUser = new UserEntity();
    newUser.email = createUsersDto.email;
    newUser.password = bcrypt.hashSync(createUsersDto.password, 10);
    return this.usersRepository.save(newUser);
  }

  async findByEmail(email: string) {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async findAll() {
    return await this.usersRepository.find();
  }

  async findMe(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['playlists'],
    });

    if (!user) throw new Error('User not found');

    // Exclude password in the returned object
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  async findOne(id: number) {
    return await this.usersRepository.findOne({
      where: { id },
      relations: ['playlists'],
    });
  }

  async blockUser(id: number) {
    await this.usersRepository.update(id, { blocked: true });
    return this.findOne(id);
  }

  async unblockUser(id: number) {
    await this.usersRepository.update(id, { blocked: false });
    return this.findOne(id);
  }

  async update(id: number, updateUsersDto: UpdateUsersDto) {
    if (updateUsersDto.password) {
      const salt = await bcrypt.genSalt();
      updateUsersDto.password = await bcrypt.hash(
        updateUsersDto.password,
        salt,
      );
    }
    await this.usersRepository.update(id, updateUsersDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.usersRepository.softDelete(id);
    return await this.usersRepository.findOne({
      where: { id },
      withDeleted: true,
    });
  }
}
