// likedmusics.repository.ts
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LikedMusicEntity } from './entities/likedmusics.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { MusicEntity } from 'src/musics/entities/music.entity';

@Injectable()
export class LikedMusicsRepository {
  constructor(
    @InjectRepository(LikedMusicEntity)
    private readonly likedMusicsRepository: Repository<LikedMusicEntity>,
  ) {}

  async createAndSave(userId: number, musicId: number): Promise<LikedMusicEntity> {
    const likedMusic = this.likedMusicsRepository.create({
      user: { id: userId } as UserEntity,
      music: { id: musicId } as MusicEntity,
    });

    try {
      return await this.likedMusicsRepository.save(likedMusic);
    } catch (error) {
      if (error.code === '23505') { 
        throw new ConflictException('you already liked this song');
      }
      throw error;
    }
  }

  async deleteByUserAndMusic(userId: number, musicId: number): Promise<void> {
    await this.likedMusicsRepository.delete({
      user: { id: userId } as UserEntity,
      music: { id: musicId } as MusicEntity,
    });
  }

  async findByUser(userId: number): Promise<LikedMusicEntity[]> {
    return this.likedMusicsRepository.find({
      where: { user: { id: userId } },
      relations: ['music'],
    });
  }
}
