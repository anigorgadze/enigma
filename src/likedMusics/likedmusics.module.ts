// liked-music.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikedMusicEntity } from './entities/likedmusics.entity';
import { LikedMusicService } from './likedmusics.service';
import { LikedMusicController } from './likedmusics.controller';
import { LikedMusicsRepository } from './likedmusics.repository';


@Module({
  imports: [TypeOrmModule.forFeature([LikedMusicEntity])],
  providers: [LikedMusicService,LikedMusicsRepository],
  controllers: [LikedMusicController],
})
export class LikedMusicModule {}
