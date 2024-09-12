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
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('playlists')
@UseGuards(RolesGuard)
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @Roles(Role.Admin, Role.User)
  @Post()
  create(@Body() createPlaylistDto: CreatePlaylistDto, @Request() req) {
    return this.playlistsService.create(createPlaylistDto, req.user.sub);
  }

  @Get()
  findAll() {
    return this.playlistsService.findAll();
  }

  @Roles(Role.Admin, Role.User)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playlistsService.findOne(+id);
  }

  @Roles(Role.Admin, Role.User)
  @Patch('addToPlaylist')
  addMusicToPlaylist(@Body() updatePlaylistDto: UpdatePlaylistDto) {
    return this.playlistsService.addMusicToPlaylist(updatePlaylistDto);
  }

  
  @Roles(Role.Admin, Role.User)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePlaylistDto: UpdatePlaylistDto,
  ) {
    return this.playlistsService.update(+id, updatePlaylistDto);
  }

  @Roles(Role.Admin, Role.User)
  @Delete('musicId')
  removeMusicFromPlaylist(@Body() createPlaylistDto: CreatePlaylistDto) {
    return this.playlistsService.removeMusicFromPlaylist(createPlaylistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.playlistsService.remove(+id);
  }
}
