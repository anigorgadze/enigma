import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { MusicsRepository } from 'src/musics/musics.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicEntity } from 'src/musics/entities/music.entity';
import { AuthorsRepository } from 'src/authors/authors.repository';
import { AlbumsRepository } from 'src/albums/albums.repository';
import { AlbumEntity } from 'src/albums/entities/album.entity';
import { AuthorEntity } from 'src/authors/entities/author.entity';
import { MusicsModule } from 'src/musics/musics.module';
import { AuthorsModule } from 'src/authors/authors.module';
import { AlbumsModule } from 'src/albums/albums.module';

@Module({
  imports: [MusicsModule, AuthorsModule, AlbumsModule],
  providers: [SearchService],
  controllers: [SearchController],
})
export class SearchModule {}
