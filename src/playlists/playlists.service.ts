import { Injectable } from '@nestjs/common';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { PlaylistsRepository } from './playlists.repository';

@Injectable()
export class PlaylistsService {
  constructor(private readonly playlistRepository: PlaylistsRepository) {}

  create(createPlaylistDto: CreatePlaylistDto, userId: number) {
    return this.playlistRepository.create(createPlaylistDto, userId);
  }

  findAll() {
    return this.playlistRepository.findAll();
  }

  findOne(id: number) {
    return this.playlistRepository.findOne(id);
  }

  update(id: number, updatePlaylistDto: UpdatePlaylistDto) {
    return this.playlistRepository.update(id, updatePlaylistDto);
  }

  remove(id: number) {
    return this.playlistRepository.remove(id);
  }
}
