import { Module } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { AlbumsRepository } from './albums.repository';
import { AlbumsController } from './albums.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumEntity } from './entities/album.entity';
import { FilesModule } from 'src/files/files.module';


@Module({
  imports: [TypeOrmModule.forFeature([AlbumEntity]) , FilesModule],
  controllers: [AlbumsController],
  providers: [AlbumsService, AlbumsRepository],
  exports: [AlbumsRepository],
})
export class AlbumsModule {}
