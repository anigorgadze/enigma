import { Injectable } from '@nestjs/common';
import { AuthorsRepository } from './authors.repository';
import { CreateAuthorsDto } from './dto/create-authors.dto';
import { UpdateAuthorsDto } from './dto/update-authors.dto';

@Injectable()
export class AuthorsService {
  constructor(private readonly authorsRepository: AuthorsRepository) {}
  async create(createAuthorsDto: CreateAuthorsDto) {
    return await this.authorsRepository.create(createAuthorsDto);
  }

  async findAll() {
    return await this.authorsRepository.findAll();
  }

  async findOne(id: number) {
    return await this.authorsRepository.findOne(id);
  }

  async update(id: number, updateAuthorsDto: UpdateAuthorsDto) {
    return await this.authorsRepository.update(id, updateAuthorsDto);
  }

  async remove(id: number) {
    return await this.authorsRepository.remove(id);
  }
}
