import { Injectable } from '@nestjs/common';
import { AuthorsRepository } from './authors.repository';
import { CreateAuthorsDto } from './dto/create-authors.dto';
import { UpdateAuthorsDto } from './dto/update-authors.dto';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class AuthorsService {
  constructor(
    private readonly authorsRepository: AuthorsRepository,
    private readonly filesService: FilesService,
  ) {}

  async create(
    createAuthorsDto: CreateAuthorsDto,
    picture: Express.Multer.File,
  ) {
    const coverImgUrl = await this.filesService.uploadFile(picture, 'Images');
    return this.authorsRepository.create(createAuthorsDto, coverImgUrl.url);
  }

  async findAll() {
    return await this.authorsRepository.findAll();
  }

  async findOne(id: number) {
    return await this.authorsRepository.findOne(id);
  }

  async update(
    id: number,
    updateAuthorsDto: UpdateAuthorsDto,
    picture?: Express.Multer.File,
  ) {
    let coverImgUrl: string | undefined;

    if (picture) {
      coverImgUrl = (await this.filesService.uploadFile(picture, 'Images')).url;
    }

    return await this.authorsRepository.update(
      id,
      updateAuthorsDto,
      coverImgUrl,
    );
  }

  async remove(id: number) {
    return await this.authorsRepository.remove(id);
  }
}
