import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlaylistEntity } from './entities/playlist.entity';
import { Repository } from 'typeorm';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { MusicEntity } from 'src/musics/entities/music.entity';
import { NotFoundError } from 'rxjs';

@Injectable()
export class PlaylistsRepository {
  constructor(
    @InjectRepository(PlaylistEntity)
    private readonly playlistRepository: Repository<PlaylistEntity>,
  ) {}
  async create(createPlaylistDto: CreatePlaylistDto, userId: number) {
    const newPlaylist = new PlaylistEntity();
    newPlaylist.title = createPlaylistDto.title;
    newPlaylist.userId = userId;

    await this.playlistRepository.save(newPlaylist);

    return newPlaylist;
  }

  async findAll() {
    return await this.playlistRepository
      .createQueryBuilder('playlist')
      .leftJoinAndSelect('playlist.musics', 'playlistMusic')
      .getMany();
  }

  async findOne(id: number) {
    return await this.playlistRepository
      .createQueryBuilder('playlist')
      .leftJoinAndSelect('playlist.musics', 'playlistMusic')
      .where('playlist.id =:id', { id })
      .getOne();
  }

  async update(id: number, updatePlaylistDto: UpdatePlaylistDto) {
    const playlist = await this.playlistRepository.findOne({
      where: { id },
      relations: { musics: true },
    });

    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    playlist.title = updatePlaylistDto.title;

    if (updatePlaylistDto.musicId) {
      const music = await this.playlistRepository.manager.findOne(MusicEntity, {
        where: { id: updatePlaylistDto.musicId },
      });

      if (!music) {
        throw new InternalServerErrorException('Music not found');
      }

      if (!playlist.musics.some((m) => m.id === music.id)) {
        playlist.musics.unshift(music);
      }
    }

    try {
      await this.playlistRepository.save(playlist);
      return playlist;
    } catch (err) {
      throw new InternalServerErrorException(
        'Could not update playlist, try again later!',
      );
    }
  }

  async addMusicToPlaylist(updatePlaylistDto: UpdatePlaylistDto) {
    const playlist = await this.playlistRepository.findOne({
      where: { id: updatePlaylistDto.playlistId },
      relations: { musics: true },
    });

    if (!playlist) {
      throw new InternalServerErrorException('Playlist not found');
    }

    if (updatePlaylistDto.musicId) {
      const music = await this.playlistRepository.manager.findOne(MusicEntity, {
        where: { id: updatePlaylistDto.musicId },
      });

      if (!music) {
        throw new InternalServerErrorException('Music not found');
      }

      if (!playlist.musics.some((m) => m.id === music.id)) {
        playlist.musics.unshift(music);
      }
    }

    try {
      await this.playlistRepository.save(playlist);
      return playlist;
    } catch (err) {
      throw new InternalServerErrorException(
        'Could not update playlist, try again later!',
      );
    }
  }

  async removeMusicFromPlaylist(createPlaylistDto: CreatePlaylistDto) {
    const { playlistId, musicId } = createPlaylistDto;

    const playlist = await this.playlistRepository.findOne({
      where: { id: playlistId },
      relations: { musics: true },
    });

    if (!playlist) {
      throw new InternalServerErrorException('Playlist not found');
    }

    const musicIndex = playlist.musics.findIndex((m) => m.id === musicId);
    if (musicIndex === -1) {
      throw new InternalServerErrorException('Music not found in playlist');
    }

    playlist.musics.splice(musicIndex, 1);

    try {
      await this.playlistRepository.save(playlist);
      return playlist;
    } catch (err) {
      throw new InternalServerErrorException(
        'Could not remove music from playlist, try again later!',
      );
    }
  }

  async remove(id: number) {
    await this.playlistRepository
      .createQueryBuilder('playlist')
      .where('playlist.id =:id', { id })
      .softDelete()
      .execute();

    return await this.playlistRepository
      .createQueryBuilder('playlist')
      .withDeleted()
      .where('playlist.id =:id', { id })
      .getOne();
  }
}
