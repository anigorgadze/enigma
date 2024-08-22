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
import { UpdateAuthorsDto } from './dto/update-authors.dto';
import { Public } from 'src/auth/public.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';


interface Files {
  picture?: Express.Multer.File[];
}

@Controller('authors')
@Public()
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) { }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'picture', maxCount: 1 },
    ]),
  )

  create(
    @UploadedFiles() files: Files,
    @Body() createAuthorsDto: CreateAuthorsDto,
  ) {

    const { picture } = files;
    if (!picture) {
      throw new InternalServerErrorException('Files are missing');
    }
    return this.authorsService.create(createAuthorsDto, picture[0]);
  }


  @Get()
  async findAll() {
    return await this.authorsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.authorsService.findOne(+id);
  }



  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'picture', maxCount: 1 },
    ]),
  )
  async update(
    @Param('id') id: string,
    @Body() updateAuthorDto: UpdateAuthorsDto,
    @UploadedFiles() files?: Files,
  ) {
    const { picture } = files || {};
    return await this.authorsService.update(+id, updateAuthorDto, picture ? picture[0] : undefined);
  }


  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.authorsService.remove(+id);
  }
}
