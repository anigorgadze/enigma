import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthorEntity } from './entities/author.entity';
import { CreateAuthorsDto } from './dto/create-authors.dto';

@Injectable()
export class AuthorsRepository {
  constructor(
    @InjectRepository(AuthorEntity)
    private readonly authorsRepository: Repository<AuthorEntity>,
  ) {}

  async create(createAuthorsDto: CreateAuthorsDto, coverImgUrl: string) {
    const newAuthor = new AuthorEntity();
    newAuthor.artistName = createAuthorsDto.artistName;
    newAuthor.releaseDate = createAuthorsDto.releaseDate;
    newAuthor.coverImgUrl = coverImgUrl;
    newAuthor.lastName = createAuthorsDto.lastName;
    newAuthor.biography = createAuthorsDto.biography;

    try {
      await this.authorsRepository.save(newAuthor);
      return newAuthor;
    } catch (err) {
      throw new InternalServerErrorException(
        'Could not create author, try again later!',
      );
    }
  }

  async findAll() {
    const authors = await this.authorsRepository.find({
      relations: ['musics', 'albums'],
    });
    for (const author of authors) {
      const musicsLength = author.musics.length;
      author.musicsCount = musicsLength;

      await this.authorsRepository.save(author);
      return authors;
    }
  }

  async findOne(id: number) {
    return await this.authorsRepository
      .createQueryBuilder('author')
      .where('author.id = :id', { id })
      .getOne();
  }

  async findByName(search: string) {
    return await this.authorsRepository
      .createQueryBuilder('author')
      .where('author.artistName LIKE :searchField', {
        searchField: `%${search}%`,
      })
      .getMany();
  }

  async updateAllAuthorsPlayCounts() {
    const authors = await this.authorsRepository.find({
      relations: ['musics'],
    });

    const updatePromises = authors.map(async (author) => {
      const totalPlayCount = author.musics.reduce(
        (sum, music) => sum + music.playCount,
        0,
      );
      const numberOfMusics = author.musics.length;

      author.totalPlayCount =
        numberOfMusics > 0 ? totalPlayCount / numberOfMusics : 0;

      return this.authorsRepository.save(author);
    });

    try {
      await Promise.all(updatePromises);
    } catch (err) {
      throw new InternalServerErrorException(
        'Failed to update play counts, please try again later!',
      );
    }
  }

  async topAuthors() {
    return await this.authorsRepository
      .createQueryBuilder('author')
      .orderBy('author.totalPlayCount', 'DESC')
      .take(4)
      .getMany();
  }

  async update() {}

  async remove(id: number) {
    await this.authorsRepository.softDelete(id);
    return this.authorsRepository
      .createQueryBuilder('author')
      .withDeleted()
      .where('author.id = :id', { id })
      .getOne();
  }
  async countSongs(id: number): Promise<number> {
    const author = await this.authorsRepository
      .createQueryBuilder('author')
      .leftJoinAndSelect('author.musics', 'authorMusics')
      .where('author.id = :id', { id })
      .getOne();

    if (!author) {
      throw new InternalServerErrorException('Author not found');
    }

    return author.musics.length;
  }
}
