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
  Request
} from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { CreateAlbumsDto } from './dto/create-albums.dto';
import { UpdateAlbumsDto } from './dto/update-albums.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Public } from 'src/auth/public.decorator';

interface Files {
  picture?: Express.Multer.File[];
}

@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) { }


  @Roles(Role.User)
  @Public()
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'picture', maxCount: 1 },
    ]),
  )
  create(
    @UploadedFiles() files: Files,
    @Body() createAlbumsDto: CreateAlbumsDto,
    @Request()  req
  ) {
    const { picture } = files;

    if (!picture) {
      throw new InternalServerErrorException('Files are missing');
    }
    return this.albumsService.create(createAlbumsDto, picture[0] );
  }

  @Get()
  findAll() {
    return this.albumsService.findAll();
  }



  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.albumsService.findOne(+id);
  }


  async update(
    @Param('id') id: string,
    @Body() updateAlbumsDto: UpdateAlbumsDto,
    @UploadedFiles() files?: Files,
  ) {
    const { picture } = files || {};
    return await this.albumsService.update(+id, updateAlbumsDto, picture ? picture[0] : undefined);
  }


  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.albumsService.remove(+id);
  }
}


