import { Injectable } from '@nestjs/common';
import { CreateUsersDto } from './dto/create-users.dto';
import { UpdateUsersDto } from './dto/update-users.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async create(createUserssDto: CreateUsersDto) {

    const SALT = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserssDto.password, SALT);
    const newUser = this.usersRepository.create({
      ...createUserssDto,
      password: hashedPassword,
    });
    return await this.usersRepository.save(newUser);
  }

  async findAll() {
    return await this.usersRepository.createQueryBuilder('user')
    .leftJoinAndSelect('user.playlists','playlist')
    .getMany();
  }

  async findOne(id: number) {
    return await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.playlists','playlist')
      .where('user.id =:id', { id })
      .getOne();
  }

  async update(id: number, updateUsersDto: UpdateUsersDto) {
    if (updateUsersDto.password) {
      const salt = await bcrypt.genSalt();
      updateUsersDto.password = await bcrypt.hash(
        updateUsersDto.password,
        salt,
      );
    }

    await this.usersRepository
      .createQueryBuilder('user')
      .update()
      .set(updateUsersDto)
      .where('user.id =:id', { id })
      .execute();

    return await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.playlists','playlist')
      .where('user.id =:id', { id })
      .getOne();
  }

  async remove(id: number) {
    await this.usersRepository
      .createQueryBuilder('user')
      .where('user.id =:id', { id })
      .softDelete()
      .execute();

    return await this.usersRepository
      .createQueryBuilder('user')
      .withDeleted()
      .where('user.id =:id', { id })
      .getOne();
  }
}
