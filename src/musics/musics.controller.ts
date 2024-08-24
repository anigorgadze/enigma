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
import { UpdateMusicsDto } from './dto/update-musics.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
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



  @Public()
  @Get('tophits')
  topHits(){
    return this.musicsService.topHits()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.musicsService.findOne(+id);
  }


  @Roles(Role.User)
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'picture', maxCount: 1 },
      { name: 'audio', maxCount: 1 },
    ]),
  )
  update(
    @Param('id') id: string,
    @UploadedFiles() files: Files,
    @Body() updateMusicsDto: UpdateMusicsDto,
  ) {
    const { picture, audio } = files;
    return this.musicsService.update(+id, updateMusicsDto,
       picture ? picture[0] : null, audio ? audio[0] : null);
  }


  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.musicsService.remove(+id);
  }
}