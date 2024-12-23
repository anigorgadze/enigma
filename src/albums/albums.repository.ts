import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { AlbumEntity } from './entities/album.entity';
import { CreateAlbumsDto } from './dto/create-albums.dto';
import { UpdateAlbumsDto } from './dto/update-albums.dto';
import { MusicEntity } from 'src/musics/entities/music.entity';
import { AuthorEntity } from 'src/authors/entities/author.entity';
import { AuthorsService } from 'src/authors/authors.service';

@Injectable()
export class AlbumsRepository {
  constructor(
    @InjectRepository(AlbumEntity)
    private albumsRepository: Repository<AlbumEntity>,
    private authorsService: AuthorsService,
  ) {}

  async create(createAlbumsDto: CreateAlbumsDto, picture: string) {
    const author = await this.authorsService.findAuthorById(
      createAlbumsDto.authorId,
    );

    const newAlbum = new AlbumEntity();
    newAlbum.artistName = createAlbumsDto.artistName;
    newAlbum.coverImgUrl = picture;
    newAlbum.title = createAlbumsDto.title;
    newAlbum.releaseDate = createAlbumsDto.releaseDate;

    newAlbum.authors = [author];

    await this.albumsRepository.save(newAlbum);

    return newAlbum;
  }

  async findAll() {
    return await this.albumsRepository
      .createQueryBuilder('album')
      .leftJoinAndSelect('album.musics', 'albumMusics')
      .leftJoinAndSelect('album.authors', 'albumAuthors')
      .getMany();
  }

  async findOne(id: number) {
    return await this.albumsRepository
      .createQueryBuilder('album')
      .leftJoinAndSelect('album.musics', 'albumMusics')
      .leftJoinAndSelect('album.authors', 'albumAuthors')
      .where('album.id = :id', { id })
      .getOne();
  }

  async findByTitle(search: string) {
    const albums = await this.albumsRepository.find({
      relations: {
        musics: true,
      },
      where: {
        title: Like(`%${search}%`),
      },
    });

    return albums;
  }

  async update(id: number, coverImgUrl: string) {
    const author = await this.albumsRepository.findOne({ where: { id } });
    if (!author) {
      throw new InternalServerErrorException('Album not found');
    }

    author.coverImgUrl = coverImgUrl;

    try {
      return await this.albumsRepository.save(author);
    } catch (err) {
      throw new InternalServerErrorException('Failed to update album image');
    }
  }

  async updateAllAlbumsPlayCounts(): Promise<void> {
    const albums = await this.albumsRepository.find({
      relations: ['musics'],
    });

    const updatePromises = albums.map(async (album) => {
      const totalPlayCount = album.musics.reduce(
        (sum, music) => sum + music.playCount,
        0,
      );
      const numberOfMusics = album.musics.length;

      album.totalPlayCount =
        numberOfMusics > 0 ? totalPlayCount / numberOfMusics : 0;

      return this.albumsRepository.save(album);
    });

    try {
      await Promise.all(updatePromises);
    } catch (err) {
      throw new InternalServerErrorException(
        'Failed to update play counts, please try again later!',
      );
    }
  }

  async topAlbums(): Promise<AlbumEntity[]> {
    return await this.albumsRepository
      .createQueryBuilder('album')
      .orderBy('album.totalPlayCount', 'DESC')
      .take(50)
      .getMany();
  }

  async recentlyAddedAlbums(): Promise<AlbumEntity[]> {
    return await this.albumsRepository
      .createQueryBuilder('album')
      .orderBy('album.createdAt', 'DESC')
      .take(20)
      .getMany();
  }

  async remove(id: number) {
    await this.albumsRepository
      .createQueryBuilder('album')
      .where('album.id = :id', { id })
      .softDelete()
      .execute();

    return await this.albumsRepository
      .createQueryBuilder('album')
      .withDeleted()
      .where('album.id = :id', { id })
      .getOne();
  }
}
