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

    await this.musicsRepository.save(music);

    await this.musicsRepository
      .createQueryBuilder()
      .relation(MusicEntity, 'albums')
      .of(music)
      .add(album);

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
      .take(4)
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

  async update(
    id: number,
    updateMusicsDto: UpdateMusicsDto,
    coverImgUrl?: string,
    audioUrl?: string,
  ) {
    const music = await this.musicsRepository.findOne({
      where: { id },
      relations: ['authors', 'albums', 'playlist'],
    });

    if (!music) {
      throw new InternalServerErrorException('Music not found');
    }

    if (updateMusicsDto.title) {
      music.title = updateMusicsDto.title;
    }

    if (coverImgUrl) {
      music.coverImgUrl = coverImgUrl;
    }

    if (audioUrl) {
      music.audioUrl = audioUrl;
    }

    if (updateMusicsDto.authorsIds) {
      const currentAuthorIds = music.authors.map((author) => author.id);
      const newAuthorIds = updateMusicsDto.authorsIds.filter(
        (id) => !currentAuthorIds.includes(id),
      );
      const allAuthorIds = [...currentAuthorIds, ...newAuthorIds];

      music.authors = allAuthorIds.map((id) => ({ id }) as AuthorEntity);
    }

    if (updateMusicsDto.albumsIds) {
      const currentAlbumIds = music.albums.map((album) => album.id);
      const newAlbumIds = updateMusicsDto.albumsIds.filter(
        (id) => !currentAlbumIds.includes(id),
      );
      const allAlbumIds = [...currentAlbumIds, ...newAlbumIds];

      music.albums = allAlbumIds.map((id) => ({ id }) as AlbumEntity);
    }

    if (updateMusicsDto.playlistsIds) {
      const currentPlaylistIds = music.playlist.map((playlist) => playlist.id);
      const newPlaylistIds = updateMusicsDto.playlistsIds.filter(
        (id) => !currentPlaylistIds.includes(id),
      );
      const allPlaylistIds = [...currentPlaylistIds, ...newPlaylistIds];

      music.playlist = allPlaylistIds.map((id) => ({ id }) as PlaylistEntity);
    }

    try {
      await this.musicsRepository.save(music);
      return music;
    } catch (err) {
      throw new InternalServerErrorException(
        'Could not update music, try again later!',
      );
    }
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
