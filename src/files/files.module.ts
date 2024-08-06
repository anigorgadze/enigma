import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { MusicEntity } from 'src/musics/entities/music.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesService } from './files.service';

@Module({
  imports: [TypeOrmModule.forFeature([MusicEntity])],
  providers: [FilesService],
  controllers: [FilesController]
})
export class FilesModule {}
