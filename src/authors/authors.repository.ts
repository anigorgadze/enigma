import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthorEntity } from './entities/author.entity';
import { CreateAuthorsDto } from './dto/create-authors.dto';
import { UpdateAuthorsDto } from './dto/update-authors.dto';
import { MusicEntity } from 'src/musics/entities/music.entity';
import { AlbumEntity } from 'src/albums/entities/album.entity';

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
      const totalPlayCount = author.musics.reduce((sum, music) => sum + music.playCount, 0);
      const numberOfMusics = author.musics.length;

      author.totalPlayCount = numberOfMusics > 0 ? totalPlayCount / numberOfMusics : 0;

      return this.authorsRepository.save(author);
    });

    try {
      await Promise.all(updatePromises);
    } catch (err) {
      throw new InternalServerErrorException('Failed to update play counts, please try again later!');

    }
  }

  async topAuthors() {
    return await this.authorsRepository
      .createQueryBuilder('author')
      .orderBy('author.totalPlayCount', 'DESC')
      .take(4)
      .getMany();
  }


  async update(
    id: number,
    updateAuthorsDto: UpdateAuthorsDto,
    coverImgUrl?: string,
  ) {
    const author = await this.authorsRepository.findOne({
      where: { id },
      relations: ['musics', 'albums'],
    });

    if (!author) {
      throw new InternalServerErrorException('Author not found');
    }

    author.artistName = updateAuthorsDto.artistName;
    author.releaseDate = updateAuthorsDto.releaseDate;
    author.lastName = updateAuthorsDto.lastName;
    author.biography = updateAuthorsDto.biography;

    if (coverImgUrl) {
      author.coverImgUrl = coverImgUrl;
    }

    if (updateAuthorsDto.musicsIds) {
      const currentMusicIds = author.musics.map((music) => music.id);
      const newMusicIds = updateAuthorsDto.musicsIds.filter(
        (id) => !currentMusicIds.includes(id),
      );
      const allMusicIds = [...currentMusicIds, ...newMusicIds];

      author.musics = allMusicIds.map((id) => ({ id }) as MusicEntity);
    }

    if (updateAuthorsDto.albumsIds) {
      const currentAlbumIds = author.albums.map((album) => album.id);
      const newAlbumIds = updateAuthorsDto.albumsIds.filter(
        (id) => !currentAlbumIds.includes(id),
      );
      const allAlbumIds = [...currentAlbumIds, ...newAlbumIds];

      author.albums = allAlbumIds.map((id) => ({ id }) as AlbumEntity);
    }

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
