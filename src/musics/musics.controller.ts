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
  UseInterceptors,
} from '@nestjs/common';
import { MusicsService } from './musics.service';
import { CreateMusicsDto } from './dto/create-musics.dto';
import { UpdateMusicsDto } from './dto/update-musics.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

interface Files {
  picture?: Express.Multer.File[];
  audio?: Express.Multer.File[];
}

@Controller('musics')
export class MusicsController {
  constructor(private readonly musicsService: MusicsService) {}
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'picture', maxCount: 1 },
      { name: 'audio', maxCount: 1 },
    ]),
  )
  create(
    @UploadedFiles() files: Files,
    @Body() createMusicsDto: CreateMusicsDto,
  ) {
    const { picture, audio } = files;
    if (!picture || !audio) {
      throw new InternalServerErrorException('Files are missing');
    }
    return this.musicsService.create(createMusicsDto, picture[0], audio[0]);
  }

  @Get()
  findAll() {
    return this.musicsService.findAll();
  }

  @Get('tophits')
  topHits(){
    return this.musicsService.topHits()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.musicsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMusicsDto: UpdateMusicsDto) {
    return this.musicsService.update(+id, updateMusicsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.musicsService.remove(+id);
  }
}