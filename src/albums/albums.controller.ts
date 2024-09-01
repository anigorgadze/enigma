import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  Request,
  Query,
} from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { CreateAlbumsDto } from './dto/create-albums.dto';
import { UpdateAlbumsDto } from './dto/update-albums.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Public } from 'src/auth/public.decorator';
import { MusicEntity } from 'src/musics/entities/music.entity';

interface Files {
  picture?: Express.Multer.File[];
  audio?: Express.Multer.File[];
  musicPicture?: Express.Multer.File[];
}

@Controller('albums')
@Public()
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'picture', maxCount: 1 }]))
  create(
    @UploadedFiles() files: Files,
    @Body() createAlbumsDto: CreateAlbumsDto,
    @Request() req,
  ) {
    const { picture } = files;

    if (!picture) {
      throw new InternalServerErrorException('Files are missing');
    }
    return this.albumsService.create(createAlbumsDto, picture[0]);
  }

  @Get()
  findAll() {
    return this.albumsService.findAll();
  }

  @Get('top-albums')
  async getTopAlbums() {
    return this.albumsService.updateAndGetTopAlbums();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.albumsService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'picture', maxCount: 1 },
      { name: 'musicPicture', maxCount: 1 },
      { name: 'audio', maxCount: 1 },
    ]),
  )
  async update(
    @Param('id') id: string,
    @Body() updateAlbumsDto: UpdateAlbumsDto,
    @UploadedFiles() files?: Files,
  ) {
    const { picture, audio, musicPicture } = files;

    return await this.albumsService.update(
      +id,
      updateAlbumsDto,
      picture ? picture[0] : null,
      audio,
      musicPicture ? musicPicture[0] : null,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.albumsService.remove(+id);
  }
}
