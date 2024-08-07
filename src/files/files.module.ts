import { Module } from '@nestjs/common';
import { MusicEntity } from 'src/musics/entities/music.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesService } from './files.service';

@Module({
  imports: [TypeOrmModule.forFeature([MusicEntity])],
  providers: [FilesService],
  exports: [FilesService],

})
export class FilesModule {}
