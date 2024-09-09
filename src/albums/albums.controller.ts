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
import { AlbumsService } from './albums.service';
import { CreateAlbumsDto } from './dto/create-albums.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';

interface Files {
  picture?: Express.Multer.File[];
  audio?: Express.Multer.File[];
  musicPicture?: Express.Multer.File[];
}
@Controller('albums')
@UseGuards(RolesGuard)
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

  @Roles(Role.Admin, Role.User)
  @Get()
  findAll() {
    return this.albumsService.findAll();
  }

  @Get('recent')
  async getRecentlyAddedAlbums() {
    return this.albumsService.getRecentlyAddedAlbums();
  }

  @Roles(Role.Admin, Role.User)
  @Get('top-albums')
  async getTopAlbums() {
    return this.albumsService.updateAndGetTopAlbums();
  }

  @Roles(Role.Admin, Role.User)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.albumsService.findOne(+id);
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
    return await this.albumsService.update(+id, picture[0]);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.albumsService.remove(+id);
  }
}
