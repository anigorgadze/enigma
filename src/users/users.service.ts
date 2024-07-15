import { Injectable } from "@nestjs/common";
import { UsersRepository } from "./users.repository";
import { CreateUsersDto } from "./dto/create-users.dto";
import { UpdateUsersDto } from "./dto/update-users.dto";

@Injectable()
export class UsersService {

    constructor(private readonly usersRepository: UsersRepository) { }

    create(createUsersDto: CreateUsersDto) {
        return this.usersRepository.create(createUsersDto)
    }

    findAll() {
        return this.usersRepository.findAll()
    }

    findOne(id: number) {
        return this.usersRepository.findOne(id)
    }

    update(id: number, updateUsersDto: UpdateUsersDto) {
        return this.usersRepository.update(id, updateUsersDto)
    }

    remove(id: number) {
        return this.usersRepository.remove(id)
    }
}