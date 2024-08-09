import { Injectable } from '@nestjs/common';
import { AuthorsRepository } from './authors.repository';
import { CreateAuthorsDto } from './dto/create-authors.dto';
import { UpdateAuthorsDto } from './dto/update-authors.dto';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class AuthorsService {
  constructor(private readonly authorsRepository: AuthorsRepository , 
        private readonly filesService: FilesService) {}
        
async create(createAuthorsDto: CreateAuthorsDto, 
  picture: Express.Multer.File,) 
{
  const imgUrl = await this.filesService.uploadFile(picture, 'Images');   
  return this.authorsRepository.create(createAuthorsDto, imgUrl.Location)
}

  async findAll() {
    return await this.authorsRepository.findAll();
  }

  async findOne(id: number) {
    return await this.authorsRepository.findOne(id);
  }

  async update(id: number, updateAuthorsDto: UpdateAuthorsDto) {
    return await this.authorsRepository.update(id, updateAuthorsDto);
  }

  async remove(id: number) {
    return await this.authorsRepository.remove(id);
  }
}
