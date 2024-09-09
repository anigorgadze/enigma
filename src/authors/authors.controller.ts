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
import { AuthorsService } from './authors.service';
import { CreateAuthorsDto } from './dto/create-authors.dto';
import { Public } from 'src/auth/public.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { AuthGuard } from 'src/auth/auth.guard';

interface Files {
  picture?: Express.Multer.File[];
}

@Controller('authors')
@UseGuards(AuthGuard, RolesGuard)
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

  @Roles(Role.Admin, Role.User)
  @Get()
  async findAll() {
    return await this.authorsService.findAll();
  }

  @Get('recent')
  async getRecentlyAddedAuthors() {
    return this.authorsService.getRecentlyAddedAuthors();
  }

  @Roles(Role.Admin, Role.User)
  @Get('top-authors')
  async getTopAuthors() {
    return this.authorsService.updateAndGetTopAuthors();
  }

  @Roles(Role.Admin, Role.User)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.authorsService.findOne(+id);
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
    return await this.authorsService.update(+id, picture[0]);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.authorsService.remove(+id);
  }
}
