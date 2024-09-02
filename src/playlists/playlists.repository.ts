import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlaylistEntity } from './entities/playlist.entity';
import { Repository } from 'typeorm';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { MusicEntity } from 'src/musics/entities/music.entity';

@Injectable()
export class PlaylistsRepository {
  constructor(
    @InjectRepository(PlaylistEntity)
    private readonly playlistRepository: Repository<PlaylistEntity>,
  ) {}
  async create(createPlaylistDto: CreatePlaylistDto) {
    const newPlaylist = new PlaylistEntity();
    newPlaylist.title = createPlaylistDto.title;
    newPlaylist.userId = createPlaylistDto.userId;
    if (createPlaylistDto.musicsIds) {
      newPlaylist.musics = createPlaylistDto.musicsIds.map(
        (id) =>
          ({
            id,
          }) as MusicEntity,
      );
    }
    try {
      await this.playlistRepository.save(newPlaylist);
      return newPlaylist;
    } catch (err) {
      throw new InternalServerErrorException(
        'Could not create playlist, try again later!',
      );
    }
  }

  async findLikedMusicPlaylist(userId: number) {
    return await this.playlistRepository.findOne({
      where: {
        userId,
        isLikedMusicPlaylist: true,
      },
    });
  }
  async createLikedMusicPlaylist(createPlaylistDto: CreatePlaylistDto) {
    const newPlaylist = new PlaylistEntity();
    newPlaylist.title = createPlaylistDto.title;
    newPlaylist.userId = createPlaylistDto.userId;
    newPlaylist.isLikedMusicPlaylist = true;
    try {
      await this.playlistRepository.save(newPlaylist);
      return newPlaylist;
    } catch (err) {
      throw new InternalServerErrorException(
        'Could not create liked music playlist, try again later!',
      );
    }
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
      throw new InternalServerErrorException('Playlist not found');
    }

    playlist.title = updatePlaylistDto.title;

    const playlistMusic = playlist.musics.map((music) => music.id);

    updatePlaylistDto.musicsIds.forEach((musicId) => {
      if (!playlistMusic.includes(musicId)) {
        playlist.musics.push({ id: musicId } as MusicEntity);
      }
    });

    try {
      await this.playlistRepository.save(playlist);
      return playlist;
    } catch (err) {
      throw new InternalServerErrorException(
        'Could not update playlist, try again later!',
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
