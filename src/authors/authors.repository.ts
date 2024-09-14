import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { AuthorEntity } from './entities/author.entity';
import { CreateAuthorsDto } from './dto/create-authors.dto';
import { AlbumEntity } from 'src/albums/entities/album.entity';
import { MusicEntity } from 'src/musics/entities/music.entity';

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
    const authors = await this.authorsRepository
      .createQueryBuilder('author')
      .leftJoinAndSelect('author.albums', 'albums')
      .leftJoinAndSelect('albums.musics', 'musics')
      .getMany();

    return authors;
  }

  async findOne(id: number) {
    return await this.authorsRepository
      .createQueryBuilder('author')
      .where('author.id = :id', { id })
      .leftJoinAndSelect('author.musics', 'musics')
      .leftJoinAndSelect('author.albums', 'albums')
      .leftJoinAndSelect('albums.musics', 'albumMusics')
      .getOne();
  }

  async findByName(search: string) {
    const authors = await this.authorsRepository.find({
      relations: {
        albums: {
          musics: true,
        },
      },
      where: {
        artistName: Like(`%${search}%`),
      },
    });

    return authors;
  }

  async updateAllAuthorsPlayCounts() {
    const authors = await this.authorsRepository.find({
      relations: ['albums'],
    });

    const updatePromises = authors.map(async (author) => {
      if (!author.albums || author.albums.length === 0) {
        author.totalPlayCount = 0;
        return this.authorsRepository.save(author);
      }

      const totalPlayCount = author.albums.reduce((sum, album) => {
        return sum + album.totalPlayCount;
      }, 0);

      const numberOfAlbums = author.albums.length;

      author.totalPlayCount =
        numberOfAlbums > 0 ? totalPlayCount / numberOfAlbums : 0;

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
      .take(50)
      .getMany();
  }

  async update(id: number, coverImgUrl: string) {
    const author = await this.authorsRepository.findOne({ where: { id } });
    if (!author) {
      throw new InternalServerErrorException('Author not found');
    }

    author.coverImgUrl = coverImgUrl;

    try {
      return await this.authorsRepository.save(author);
    } catch (err) {
      throw new InternalServerErrorException('Failed to update author image');
    }
  }

  async recentlyAddedAuthors() {
    return await this.authorsRepository
      .createQueryBuilder('author')
      .orderBy('author.createdAt', 'DESC')
      .take(8)
      .getMany();
  }

  async remove(authorId: number) {
    const author = await this.authorsRepository
      .createQueryBuilder('author')
      .leftJoinAndSelect('author.albums', 'album')
      .leftJoinAndSelect('album.musics', 'music')
      .where('author.id = :authorId', { authorId })
      .getOne();

    if (!author) {
      throw new InternalServerErrorException('Author not found');
    }

    const albums = author.albums || [];
    const musics = albums.flatMap((album) => album.musics) || [];

    if (albums.length > 0) {
      await this.authorsRepository
        .createQueryBuilder()
        .delete()
        .from('album_musics_music')
        .whereInIds(
          albums.flatMap((album) =>
            album.musics.map((music) => ({
              albumId: album.id,
              musicId: music.id,
            })),
          ),
        )
        .execute();
    }

    if (musics.length > 0) {
      await this.authorsRepository
        .createQueryBuilder()
        .delete()
        .from(MusicEntity)
        .whereInIds(musics.map((music) => music.id))
        .execute();
    }

    if (albums.length > 0) {
      await this.authorsRepository
        .createQueryBuilder()
        .delete()
        .from(AlbumEntity)
        .whereInIds(albums.map((album) => album.id))
        .execute();
    }

    await this.authorsRepository
      .createQueryBuilder()
      .delete()
      .from(AuthorEntity)
      .where('id = :authorId', { authorId })
      .execute();
  }
}
