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
} from '@nestjs/common';
import { MusicsService } from './musics.service';
import { CreateMusicsDto } from './dto/create-musics.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Public } from 'src/auth/public.decorator';

interface Files {
  picture?: Express.Multer.File[];
  audio?: Express.Multer.File[];
}

@Controller('musics')
@Public()
export class MusicsController {
  constructor(private readonly musicsService: MusicsService) {}

  @UseGuards(JwtAuthGuard)
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

  @Public()
  @Get()
  findAll() {
    return this.musicsService.findAll();
  }
  
  @Get('recent')
  async getRecentlyAddedMusics() {
    return this.musicsService.getRecentlyAddedMusics();
  }


  @Get('shuffle')
  async shuffleMusics() {
    return this.musicsService.shuffleMusics();
  }

  @Public()
  @Get('tophits')
  topHits() {
    return this.musicsService.topHits();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.musicsService.findOne(+id);
  }
  @Patch(':id')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'picture', maxCount: 1 }]))
  async updateAuthorImage(
    @Param('id') id: string,
    @UploadedFiles() files: Files,
  ) {
    const { picture } = files;
    if (!picture) {
      throw new InternalServerErrorException('Picture file is missing');
    }
    return await this.musicsService.update(+id, picture[0]);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.musicsService.remove(+id);
  }
}
