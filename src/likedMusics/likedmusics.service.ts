import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LikedMusicsRepository } from './likedmusics.repository';

@Injectable()
export class LikedMusicService {
  constructor(private readonly likedMusicsRepository: LikedMusicsRepository) {}

  async likeMusic(userId: number, musicId: number) {
    try {
      return await this.likedMusicsRepository.createAndSave(userId, musicId);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new UnauthorizedException(error.message);
      }
      throw new UnauthorizedException(
        'cant like a song,please try again later!',
      );
    }
  }

  async unlikeMusic(userId: number, musicId: number) {
    try {
      await this.likedMusicsRepository.deleteByUserAndMusic(userId, musicId);
    } catch (error) {
      throw new UnauthorizedException(
        'cant unlike music,please try again later!',
      );
    }
  }

  async findLikedMusic(userId: number) {
    return await this.likedMusicsRepository.findByUser(userId);
  }
}
