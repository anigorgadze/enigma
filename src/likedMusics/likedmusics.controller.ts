import {
  Controller,
  Post,
  Delete,
  Param,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LikedMusicService } from './likedmusics.service';

@Controller('likedmusic')
export class LikedMusicController {
  constructor(private readonly likedMusicService: LikedMusicService) {}

  @Post(':musicId')
  likeMusic(@Param('musicId') musicId: number, @Request() req) {
    return this.likedMusicService.likeMusic(req.user.userId, musicId);
  }

  @Delete(':musicId')
  unlikeMusic(@Param('musicId') musicId: number, @Request() req) {
    return this.likedMusicService.unlikeMusic(req.user.userId, musicId);
  }

  @Get()
  findLikedMusic(@Request() req) {
    return this.likedMusicService.findLikedMusic(req.user.id);
  }
}
