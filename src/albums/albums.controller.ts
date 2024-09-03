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
  @Get('recent')
  async getRecentlyAddedAlbums() {
    return this.albumsService.getRecentlyAddedAlbums();
  }

  @Get('top-albums')
  async getTopAlbums() {
    return this.albumsService.updateAndGetTopAlbums();
  }

  @Get('top-albumsPage')
  async getTopAlbumsPage() {
    return this.albumsService.updateAndGetTopAlbumsPage();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.albumsService.findOne(+id);
  }

  @Patch(':id')
  update() {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.albumsService.remove(+id);
  }
}
