import { Module } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { PlaylistsController } from './playlists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistEntity } from './entities/playlist.entity';
import { PlaylistsRepository } from './playlists.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PlaylistEntity])],
  controllers: [PlaylistsController],
  providers: [PlaylistsService , PlaylistsRepository],
})
export class PlaylistsModule {}
