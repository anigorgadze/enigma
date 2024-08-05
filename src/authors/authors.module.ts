import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorEntity } from './entities/author.entity';
import { AuthorsController } from './authors.controller';
import { AuthorsService } from './authors.service';
import { AuthorsRepository } from './authors.repository';
import { MusicsRepository } from 'src/musics/musics.repository';
import { AlbumsRepository } from 'src/albums/albums.repository';
import { MusicEntity } from 'src/musics/entities/music.entity';
import { AlbumEntity } from 'src/albums/entities/album.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuthorEntity])],
  controllers: [AuthorsController],
  providers: [AuthorsService, AuthorsRepository],
  exports: [AuthorsRepository],
})
export class AuthorsModule {}
