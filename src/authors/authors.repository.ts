import { Injectable } from '@nestjs/common';
import { CreateAuthorsDto } from './dto/create-authors.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthorEntity } from './entities/author.entity';
import { Repository } from 'typeorm';
import { UpdateAuthorsDto } from './dto/update-authors.dto';

@Injectable()
export class AuthorsRepository {
  constructor(
    @InjectRepository(AuthorEntity)
    private readonly authorsRepository: Repository<AuthorEntity>,
  ) {}

  async create(createAuthorsDto: CreateAuthorsDto) {
    const newAuthor = this.authorsRepository.create(createAuthorsDto);
    return await this.authorsRepository.save(newAuthor);
  }

  async findAll() {
    return await this.authorsRepository.createQueryBuilder('author').getMany();
  }

  async findOne(id: number) {
    return await this.authorsRepository
      .createQueryBuilder('author')
      .where('author.id = :id', { id })
      .getOne();
  }

  async update(id: number, updateAuthorsDto: UpdateAuthorsDto) {
    await this.authorsRepository
      .createQueryBuilder('author')
      .update()
      .set(updateAuthorsDto)
      .where('author.id = :id', { id })
      .execute();

    return this.authorsRepository
      .createQueryBuilder('author')
      .where('author.id = :id', { id })
      .getOne();
  }

  async remove(id: number) {
    await this.authorsRepository.softDelete(id);
    return this.authorsRepository
      .createQueryBuilder('author')
      .withDeleted()
      .where('author.id = :id', { id })
      .getOne();
  }
}
