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
import { AuthorsService } from './authors.service';
import { CreateAuthorsDto } from './dto/create-authors.dto';
import { Public } from 'src/auth/public.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

interface Files {
  picture?: Express.Multer.File[];
}

@Controller('authors')
@Public()
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'picture', maxCount: 1 }]))
  async create(
    @UploadedFiles() files: Files,
    @Body() createAuthorsDto: CreateAuthorsDto,
  ) {
    const { picture } = files;
    if (!picture) {
      throw new InternalServerErrorException('Files are missing');
    }
    return await this.authorsService.create(createAuthorsDto, picture[0]);
  }

  @Get()
  async findAll() {
    return await this.authorsService.findAll();
  }
  @Get('recent')
  async getRecentlyAddedAuthors() {
    return this.authorsService.getRecentlyAddedAuthors();
  }
  @Get(':id/songs-count')
  async countSongs(@Param('id') id: string) {
    return await this.authorsService.countSongs(+id);
  }

  @Get('top-authors')
  async getTopAuthors() {
    return this.authorsService.updateAndGetTopAuthors();
  }


  @Get('top-authorsPage')
  async getTopAuthorsPage() {
    return this.authorsService.updateAndGetTopAuthorsPage();
  }


  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.authorsService.findOne(+id);
  }

  @Patch(':id')
  async update() {}

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.authorsService.remove(+id);
  }
}
