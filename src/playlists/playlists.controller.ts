import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('playlists')
@UseGuards(JwtAuthGuard)
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @Post()
  create(@Body() createPlaylistDto: CreatePlaylistDto, @Request() req) {
    return this.playlistsService.create(createPlaylistDto, req.user.userId);
  }

  @Get()
  findAll() {
    return this.playlistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playlistsService.findOne(+id);
  }

  @Patch('addToPlaylist')
  addMusicToPlaylist(@Body() updatePlaylistDto: UpdatePlaylistDto) {
    return this.playlistsService.addMusicToPlaylist(updatePlaylistDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePlaylistDto: UpdatePlaylistDto,
  ) {
    return this.playlistsService.update(+id, updatePlaylistDto);
  }

  @Delete('musicId')
  removeMusicFromPlaylist(@Body() createPlaylistDto: CreatePlaylistDto) {
    return this.playlistsService.removeMusicFromPlaylist(createPlaylistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.playlistsService.remove(+id);
  }
}
