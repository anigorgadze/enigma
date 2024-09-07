import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateMusicsDto } from './dto/create-musics.dto';
import { UpdateMusicsDto } from './dto/update-musics.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MusicEntity } from './entities/music.entity';
import { Repository } from 'typeorm';
import { AuthorEntity } from 'src/authors/entities/author.entity';
import { PlaylistEntity } from 'src/playlists/entities/playlist.entity';
import { AlbumEntity } from 'src/albums/entities/album.entity';
import { AlbumsService } from 'src/albums/albums.service';

@Injectable()
export class MusicsRepository {
  constructor(
    @InjectRepository(MusicEntity)
    private musicsRepository: Repository<MusicEntity>,
    private readonly albumsService: AlbumsService,
  ) {}

  async create(
    createMusicsDto: CreateMusicsDto,
    coverImgUrl: string,
    audioUrl: string,
  ) {
    const album = await this.albumsService.findAlbumById(
      createMusicsDto.albumId,
    );

    const music = new MusicEntity();
    music.artistName = createMusicsDto.artistName;
    music.title = createMusicsDto.title;
    music.audioUrl = audioUrl;
    music.coverImgUrl = coverImgUrl;

    music.albums = [album];

    await this.musicsRepository.save(music);

    return music;
  }

  findByTitle(search: string) {
    return this.musicsRepository
      .createQueryBuilder('music')
      .where('music.title LIKE :searchField', {
        searchField: `%${search}%`,
      })
      .getMany();
  }

  async topHits() {
    return await this.musicsRepository
      .createQueryBuilder('music')
      .leftJoinAndSelect('music.authors', 'author')
      .leftJoinAndSelect('music.albums', 'album')
      .orderBy('music.playCount', 'DESC')
      .take(50)
      .getMany();
  }

  async listensCounter(music: MusicEntity) {
    try {
      return await this.musicsRepository.save(music);
    } catch (err) {
      throw new InternalServerErrorException(
        'Could not save music, try again later!',
      );
    }
  }

  async findAll() {
    return await this.musicsRepository
      .createQueryBuilder('music')
      .leftJoinAndSelect('music.authors', 'author')
      .leftJoinAndSelect('music.albums', 'album')
      .getMany();
  }

  async findOne(id: number) {
    return await this.musicsRepository
      .createQueryBuilder('music')
      .leftJoinAndSelect('music.authors', 'author')
      .leftJoinAndSelect('music.albums', 'album')
      .where('music.id = :id', { id })
      .getOne();
  }
  async update(id: number, coverImgUrl: string) {
    const author = await this.musicsRepository.findOne({ where: { id } });
    if (!author) {
      throw new InternalServerErrorException('Music not found');
    }
  
    author.coverImgUrl = coverImgUrl;
  
    try {
      return await this.musicsRepository.save(author);
    } catch (err) {
      throw new InternalServerErrorException('Failed to update music image');
    }
  }

  async recentlyAddedMusics() {
    return await this.musicsRepository
      .createQueryBuilder('music')
      .orderBy('music.createdAt', 'DESC')
      .take(6)
      .getMany();
  }

  async remove(id: number) {
    const music = await this.musicsRepository.findOneBy({ id });

    if (music.id === 11) {
      throw new InternalServerErrorException(
        'Frustra amas ver washliiiiiiiiiiiiiiiiiiiii',
      );
    } else {
      await this.musicsRepository
        .createQueryBuilder('music')
        .where('music.id = :id', { id })
        .softDelete()
        .execute();

      return await this.musicsRepository
        .createQueryBuilder('music')
        .withDeleted()
        .where('music.id = :id', { id })
        .getOne();
    }
  }
}
