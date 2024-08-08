import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateAlbumsDto } from './dto/update-albums.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AlbumEntity } from './entities/album.entity';
import { Repository } from 'typeorm';
import { CreateAlbumsDto } from './dto/create-albums.dto';
import { MusicEntity } from 'src/musics/entities/music.entity';
import { AuthorEntity } from 'src/authors/entities/author.entity';

@Injectable()
export class AlbumsRepository {
  constructor(
    @InjectRepository(AlbumEntity)
    private albumsRepository: Repository<AlbumEntity>
  ) {}

  async create(createAlbumsDto: CreateAlbumsDto,
    picture: string) {
    const newAlbum = new AlbumEntity();
    newAlbum.artistName = createAlbumsDto.artistName;
    newAlbum.coverUrl = picture;
    // console.log(picture);
    
    newAlbum.title = createAlbumsDto.title;
    newAlbum.releaseDate = createAlbumsDto.releaseDate;
    newAlbum.musics = createAlbumsDto.musicsIds.map(
      (id) =>
        ({
          id,
        }) as MusicEntity,
    );

    try {
      await this.albumsRepository.save(newAlbum);
      return newAlbum;
    } catch (exc) {
      throw new InternalServerErrorException(
        'Could not create album, try again later!',
      );
    }
  }

  async findAll() {
    return await this.albumsRepository
      .createQueryBuilder('album')
      .leftJoinAndSelect('album.musics', 'albumMusics')
      .getMany();
  }

  async findOne(id: number) {
    return await this.albumsRepository
      .createQueryBuilder('album')
      .leftJoinAndSelect('album.musics', 'albumMusics')
      .where('album.id =:id', { id })
      .getOne();
  }

  async findByTitle(search: string) {
    return await this.albumsRepository
      .createQueryBuilder('album')
      .where('album.title LIKE :searchField', {
        searchField: `%${search}%`,
      })
      .getMany();
  }

  async update(id: number, updateAlbumsDto: UpdateAlbumsDto) {
    const album = await this.albumsRepository.findOne({
      where: { id },
      relations: ['musics', 'authors'],
    });

    if (!album) {
      throw new InternalServerErrorException('Author not found');
    }

    album.title = album.title;
    album.releaseDate = new Date(updateAlbumsDto.releaseDate);
    // album.coverUrl = updateAlbumsDto.coverUrl;

    album.musics = updateAlbumsDto.musicsIds.map(
      (id) => ({ id }) as MusicEntity,
    );

    album.authors = updateAlbumsDto.authorsIds.map(
      (id) => ({ id }) as AuthorEntity,
    );

    try {
      await this.albumsRepository.save(album);
      return album;
    } catch (err) {
      throw new InternalServerErrorException(
        'Could not update author, try again later!',
      );
    }
  }

  async remove(id: number) {
    await this.albumsRepository
      .createQueryBuilder('album')
      .where('album.id =:id', { id })
      .softDelete()
      .execute();

    return await this.albumsRepository
      .createQueryBuilder('album')
      .withDeleted()
      .where('album.id =:id', { id })
      .getOne();
  }
}
