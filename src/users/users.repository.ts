import { Injectable } from '@nestjs/common';
import { CreateUsersDto } from './dto/create-users.dto';
import { UpdateUsersDto } from './dto/update-users.dto';

@Injectable()
export class UsersRepository {
  private users = [];

  create(createUsersDto: CreateUsersDto) {
    const newUser = { id: this.users.length + 1, ...createUsersDto };
    this.users.push(newUser);
    return newUser;
  }

  findAll() {
    return this.users;
  }

  findOne(id: number) {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].id === Number(id)) {
        return this.users[i];
      }
    }
    return null;
  }

  update(id: number, updateUsersDto: UpdateUsersDto) {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].id === Number(id)) {
        const updatedUser = { ...this.users[i], ...updateUsersDto };
        this.users[i] = updatedUser;
        return updatedUser;
      }
    }
    return null;
  }

  remove(id: number) {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].id === Number(id)) {
        const [removedUser] = this.users.splice(i, 1);
        return removedUser;
      }
    }
    return null;
  }
}
