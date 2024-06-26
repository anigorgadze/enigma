import { Injectable } from '@nestjs/common';
import { CreateMusicDto } from './types/create-music.dto';
import { UpdateMusicDto } from './types/update-music.dto';

@Injectable()
export class MusicRepository {
  private musics = [];

  create(createMusicDto: CreateMusicDto) {
    const newMusic = { id: this.musics.length + 1, ...createMusicDto };
    this.musics.push(newMusic);
    return newMusic;
  }

  findAll() {
    return this.musics;
  }

  findOne(id: number) {
    for (let i = 0; i < this.musics.length; i++) {
      if (this.musics[i].id === Number(id)) {
        return this.musics[i];
      }
    }
    return null;
  }

  update(id: number, UpdateMusicDto: UpdateMusicDto) {
    for (let i = 0; i < this.musics.length; i++) {
      if (this.musics[i].id === Number(id)) {
        const updatedMusic = { ...this.musics[i], ...UpdateMusicDto };
        this.musics[i] = updatedMusic;
        return updatedMusic;
      }
    }
    return null;
  }

  remove(id: number) {
    for (let i = 0; i < this.musics.length; i++) {
      if (this.musics[i].id === Number(id)) {
        const [removedMusic] = this.musics.splice(i, 1);
        return removedMusic;
      }
    }
    return null;
  }
}
