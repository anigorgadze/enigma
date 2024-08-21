import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { CreateAuthorsDto } from './dto/create-authors.dto';
import { UpdateAuthorsDto } from './dto/update-authors.dto';



@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) { }

  @Post()

  create(
    @Body() createAuthorsDto: CreateAuthorsDto,
  ) {

    return this.authorsService.create(createAuthorsDto);
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
  async update(
    @Param('id') id: string,
    @Body() updateAuthorDto: UpdateAuthorsDto,
  ) {
    return await this.authorsService.update(+id, updateAuthorDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.authorsService.remove(+id);
  }
}
