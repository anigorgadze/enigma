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
import { AlbumsService } from './albums.service';
import { CreateAlbumsDto } from './dto/create-albums.dto';
import { UpdateAlbumsDto } from './dto/update-albums.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

interface Files {
  picture?: Express.Multer.File[];
}

@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'picture', maxCount: 1 },
    ]),
  )
  create(
    @UploadedFiles() files: Files,
    @Body() createAlbumsDto: CreateAlbumsDto,
  ) {
    const  {picture}  = files;

    // console.log(picture);
    
    if (!picture ) {
      throw new InternalServerErrorException('Files are missing');
    }
    return this.albumsService.create(createAlbumsDto, picture[0]);
  }

  @Get()
  findAll() {
    return this.albumsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.albumsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAlbumsDto: UpdateAlbumsDto) {
    return this.albumsService.update(+id, updateAlbumsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.albumsService.remove(+id);
  }
}


