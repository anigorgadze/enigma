import { Module } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { AlbumsRepository } from './albums.repository';
import { AlbumsController } from './albums.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumEntity } from './entities/album.entity';
import { FilesModule } from 'src/files/files.module';
import { MusicEntity } from 'src/musics/entities/music.entity';
import { AuthorsModule } from 'src/authors/authors.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AlbumEntity, MusicEntity]),
    FilesModule,
    AuthorsModule,
  ],
  controllers: [AlbumsController],
  providers: [AlbumsService, AlbumsRepository],
  exports: [AlbumsRepository, AlbumsService],
})
export class AlbumsModule {}
