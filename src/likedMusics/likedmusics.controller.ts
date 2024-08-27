// import { Controller, Post, Delete, Param, Get, Request, UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
// import { LikedMusicService } from './likedmusics.service';
// import { Public } from 'src/auth/public.decorator';

// @Controller('likedmusic')
// @Public()
// export class LikedMusicController {
//   constructor(private readonly likedMusicService: LikedMusicService) {}

// //   @UseGuards(JwtAuthGuard)
//   @Post(':musicId')
//   likeMusic(@Param('musicId') musicId: number, @Request() req) {
//     console.log(req.user)
//     return this.likedMusicService.likeMusic(req.user, musicId);
//   }

// //   @UseGuards(JwtAuthGuard)
//   @Delete(':musicId')
//   unlikeMusic(@Param('musicId') musicId: number, @Request() req) {
//     return this.likedMusicService.unlikeMusic(req.user, musicId);
//   }

// //   @UseGuards(JwtAuthGuard)
//   @Get()
//   findLikedMusic(@Request() req) {
//     return this.likedMusicService.findLikedMusic(req.user);
//   }
// }



import { Controller, Post, Delete, Param, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LikedMusicService } from './likedmusics.service';

@Controller('likedmusic')
export class LikedMusicController {
  constructor(private readonly likedMusicService: LikedMusicService) {}

//   @UseGuards(JwtAuthGuard)
  @Post(':musicId')
  likeMusic(@Param('musicId') musicId: number, @Request() req) {
    
    return this.likedMusicService.likeMusic(req.user.userId, musicId);
  }

//   @UseGuards(JwtAuthGuard)
  @Delete(':musicId')
  unlikeMusic(@Param('musicId') musicId: number, @Request() req) {
    return this.likedMusicService.unlikeMusic(req.user.userId, musicId);
  }

//   @UseGuards(JwtAuthGuard)
  @Get()
  findLikedMusic(@Request() req) {
    return this.likedMusicService.findLikedMusic(req.user.id);
  }
}
