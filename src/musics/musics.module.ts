import { Module } from '@nestjs/common';
import { MusicsController } from './musics.controller';
import { MusicsService } from './musics.service';
import { MusicsRepository } from './musics.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicEntity } from './entities/music.entity';
import { FilesModule } from 'src/files/files.module';
import { AlbumsModule } from 'src/albums/albums.module';

@Module({
  imports: [TypeOrmModule.forFeature([MusicEntity]), FilesModule, AlbumsModule],
  controllers: [MusicsController],
  providers: [MusicsService, MusicsRepository],
  exports: [MusicsRepository],
})
export class MusicsModule {}
