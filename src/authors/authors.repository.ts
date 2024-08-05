import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateAuthorsDto } from './dto/create-authors.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthorEntity } from './entities/author.entity';
import { Repository } from 'typeorm';
import { UpdateAuthorsDto } from './dto/update-authors.dto';
import { MusicEntity } from 'src/musics/entities/music.entity';
import { AlbumEntity } from 'src/albums/entities/album.entity';

@Injectable()
export class AuthorsRepository {
  constructor(
    @InjectRepository(AuthorEntity)
    private readonly authorsRepository: Repository<AuthorEntity>,
  ) {}

  async create(createAuthorsDto: CreateAuthorsDto) {
    const newAuthor = new AuthorEntity();
    newAuthor.name = createAuthorsDto.name;
    newAuthor.imgUrl = createAuthorsDto.imgUrl;

    if (createAuthorsDto.musicsIds) {
      newAuthor.musics = createAuthorsDto.musicsIds.map(
        (id) =>
          ({
            id,
          }) as MusicEntity,
      );
    }
    if (createAuthorsDto.albumsIds) {
      newAuthor.albums = createAuthorsDto.albumsIds.map(
        (id) =>
          ({
            id,
          }) as AlbumEntity,
      );
    }

    try {
      await this.authorsRepository.save(newAuthor);
      return newAuthor;
    } catch (err) {
      throw new InternalServerErrorException(
        'Could not create album, try again later!',
      );
    }
  }

  async findAll() {
    return await this.authorsRepository
      .createQueryBuilder('author')
      .leftJoinAndSelect('author.musics', 'authorMusics')
      .leftJoinAndSelect('author.albums', 'authorAlbums')
      .getMany();
  }

  async findOne(id: number) {
    return await this.authorsRepository
      .createQueryBuilder('author')
      .leftJoinAndSelect('author.musics', 'authorMusics')
      .leftJoinAndSelect('author.albums', 'authorAlbums')
      .where('author.id = :id', { id })
      .getOne();
  }

  async findByName(search: string) {
    return await this.authorsRepository
      .createQueryBuilder('author')
      .where('author.name LIKE :searchField', {
        searchField: `%${search}%`,
      })
      .getMany();
  }

  async update(id: number, updateAuthorsDto: UpdateAuthorsDto) {
    const author = await this.authorsRepository.findOne({
      where: { id },
      relations: ['musics', 'albums'],
    });

    if (!author) {
      throw new InternalServerErrorException('Author not found');
    }

    author.name = updateAuthorsDto.name;
    author.releaseDate = new Date(updateAuthorsDto.releaseDate);
    author.imgUrl = updateAuthorsDto.imgUrl;

    author.musics = updateAuthorsDto.musicsIds.map(
      (id) => ({ id }) as MusicEntity,
    );

    author.albums = updateAuthorsDto.albumsIds.map(
      (id) => ({ id }) as AlbumEntity,
    );
    try {
      await this.authorsRepository.save(author);
      return author;
    } catch (err) {
      throw new InternalServerErrorException(
        'Could not update author, try again later!',
      );
    }
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
