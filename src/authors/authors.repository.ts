import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateAuthorsDto } from './dto/create-authors.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthorEntity } from './entities/author.entity';
import { Repository } from 'typeorm';
import { UpdateAuthorsDto } from './dto/update-authors.dto';
import { MusicEntity } from 'src/musics/entities/music.entity';
import { AlbumEntity } from 'src/albums/entities/album.entity';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class AuthorsRepository {
  constructor(
    @InjectRepository(AuthorEntity)
    private readonly authorsRepository: Repository<AuthorEntity>,
    private filesService: FilesService,
  ) { }

  async create(createAuthorsDto: CreateAuthorsDto,
    picture: string,
  ) {
    const newAuthor = new AuthorEntity();
    newAuthor.artistName = createAuthorsDto.artistName;
    newAuthor.releaseDate = createAuthorsDto.releaseDate
    newAuthor.coverImgUrl = picture;

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
      .where('author.artistName LIKE :searchField', {
        searchField: `%${search}%`,
      })
      .getMany();
  }

  async update(id: number, updateAuthorsDto: UpdateAuthorsDto ,  coverImgUrl?: string) {
    const author = await this.authorsRepository.findOne({
      where: { id },
      relations: ['musics', 'albums'],
    });

    if (!author) {
      throw new InternalServerErrorException('Author not found');
    }

    author.artistName = updateAuthorsDto.artistName;
    author.releaseDate = updateAuthorsDto.releaseDate


  if (coverImgUrl) {
    author.coverImgUrl = coverImgUrl;
  }



    if (updateAuthorsDto.musicsIds) {
      const currenMusicIds = author.musics.map((author) => author.id);
      const newMusicIds = updateAuthorsDto.musicsIds.filter(
        (id) => !currenMusicIds.includes(id),
      );
      const allMusicIds = [...currenMusicIds, ...newMusicIds];

      author.musics = allMusicIds.map((id) => ({ id }) as MusicEntity);
    }

    if (updateAuthorsDto.albumsIds) {
      const currentAlbumIds = author.albums.map((author) => author.id);
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
