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
import { Public } from 'src/auth/public.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';

interface Files {
  picture?: Express.Multer.File[];
  audio?: Express.Multer.File[];
}

@Controller('musics')
@UseGuards(RolesGuard)
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

  @Roles(Role.Admin, Role.User)
  @Get()
  findAll() {
    return this.musicsService.findAll();
  }

  @Roles(Role.Admin, Role.User)
  @Get('tophits/week')
  getTopHitsOfTheWeek() {
    return this.musicsService.getTopHitsOfTheWeek();
  }

  @Get('recent')
  async getRecentlyAddedMusics() {
    return this.musicsService.getRecentlyAddedMusics();
  }

  @Roles(Role.Admin, Role.User)
  @Get('shuffle')
  async shuffleMusics() {
    return this.musicsService.shuffleMusics();
  }

  @Roles(Role.Admin, Role.User)
  @Get('tophits')
  topHits() {
    return this.musicsService.topHits();
  }

  @Roles(Role.Admin, Role.User)
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
